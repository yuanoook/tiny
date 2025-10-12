<template>
  <div id="app">
    <!-- 顶部控制区域 -->
    <div class="top-controls">
      <!-- 游戏控制按钮 -->
      <div class="game-controls">
        <button @click="addPlayer">添加玩家</button>
        <button @click="resetGame">重置游戏</button>
        <button @click="printHistory">打印历史</button>
        
        <!-- 玩家列表 -->
        <div class="players-list">
          <div class="player" v-for="player in players" :key="player.id">
            {{ player.name }}
            <button v-if="players.length > 2" @click="removePlayer(player.id)">移除</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 玩家面板区域 -->
    <div class="player-panels">
      <PlayerPanel
        v-for="player in players"
        :key="`player-panel-${player.id}`"
        :player="player"
        :cards="cards"
        :is-active="false"
        :handle-drag-start="handleDragStart"
        :handle-drag-end="handleDragEnd"
        @card-double-click="onPlayerCardDoubleClick"
      />
    </div>
    
    <!-- 表格布局的牌堆区域 -->
    <div class="game-table">
      <!-- 表头 -->
      <TableHeader
        :base-zones="baseZones"
        :players="players"
        :cards="cards"
        :is-dragging="isDragging"
        :handle-drag-start="handleDragStart"
        :handle-drag-end="handleDragEnd"
        :handle-drag-over="handleDragOver"
        :handle-drop-to-header="handleDropToHeader"
        :toggle-card-disguise="toggleCardDisguise"
      />
      
      <!-- 行 -->
      <TableRow
        :zones="allZones"
        :all-zones="allZones"
        :cards="cards"
        :is-dragging="isDragging"
        :handle-drag-start="handleDragStart"
        :handle-drag-end="handleDragEnd"
        :handle-drag-over="handleDragOver"
        :handle-drop="handleDrop"
        :handle-drop-to-header="handleDropToHeader"
        :toggle-card-disguise="toggleCardDisguise"
      />
    </div>
    
    <!-- 拖拽时跟随鼠标的卡牌 -->
    <CardDot
      v-if="draggingCard" 
      :card="draggingCard"
      :is-dragging="true"
      :card-style="draggingCardStyle"
      class="dragging-card"
    />
    
    <!-- 卡牌操作弹窗 -->
    <CardModal 
      :showCardModal="showCardModal" 
      :currentCard="currentCard"
      @update:showCardModal="showCardModal = $event"
      @toggleCardVisibility="toggleCardVisibility"
      @setDisguiseColor="setDisguiseColor"
    />
  </div>
</template>

<script>
import CardDot from './components/CardDot.vue'
import CardModal from './components/CardModal.vue'
import TableHeader from './components/table/TableHeader.vue'
import TableRow from './components/table/TableRow.vue'
import PlayerPanel from './components/PlayerPanel.vue'
import { ref, computed, watch } from 'vue';
import { useDragAndDrop } from './composables/useDragAndDrop.js'
import { useGameLogic } from './composables/useGameLogic.js'
import { useCardOperations } from './composables/useCardOperations.js'
import { moveCardToZone, createNewCard } from './gameState.js'

export default {
  name: 'App',
  components: {
    CardDot,
    CardModal,
    TableHeader,
    TableRow,
    PlayerPanel
  },
  setup() {
    // 使用游戏逻辑
    const {
      players,
      cards,
      baseZones,
      allZones,
      getCardsInCell,
      getCardsInRowHeader,
      getCardsInColumnHeader,
      isCenterZone,
      addPlayer,
      removePlayer,
      resetGame,
      nextGlobalId,
      getCurrentGlobalId,
      updateGlobalId,
      moveCard,
      printHistory
    } = useGameLogic()
    
    // 使用拖拽逻辑
    const {
      draggingCard,
      originalDraggingCard,
      dragImage,
      draggingCardStyle,
      isDragging,
      handleDragStart: useDragAndDropHandleDragStart,
      handleDocumentDragOver,
      handleDragOver,
      handleDragEnd,
      handleDrop,
      handleDropToHeader
    } = useDragAndDrop(cards)
    
    // 处理拖拽开始
    const handleDragStart = (card, event) => {
      useDragAndDropHandleDragStart(card, event)
    }
    
    // 使用卡牌操作逻辑
    const {
      showCardModal,
      currentCard,
      toggleCardDisguise,
      toggleCardVisibility,
      setDisguiseColor
    } = useCardOperations()
    
    // 处理键盘事件
    const handleKeydown = (event) => {
      // ESC键关闭弹窗
      if (event.key === 'Escape') {
        showCardModal.value = false
      }
    }
    
    // 处理玩家面板卡牌双击事件
    const onPlayerCardDoubleClick = (card) => {
      // 设置当前卡牌并显示弹窗
      currentCard.value = card
      showCardModal.value = true
    }
    
    return {
      // 数据属性
      players,
      cards,
      baseZones,
      allZones,
      draggingCard,
      showCardModal,
      currentCard,
      dragImage,
      
      // 计算属性
      draggingCardStyle,
      
      // 方法
      isDragging,
      handleDragStart,
      handleDocumentDragOver,
      handleDragOver,
      handleDragEnd,
      handleDrop,
      handleDropToHeader,
      getCardsInCell,
      getCardsInRowHeader,
      getCardsInColumnHeader,
      isCenterZone,
      addPlayer,
      removePlayer,
      resetGame,
      toggleCardDisguise,
      toggleCardVisibility,
      setDisguiseColor,
      handleKeydown,
      onPlayerCardDoubleClick,
      printHistory
    }
  },
  mounted() {
    // 添加键盘事件监听器
    document.addEventListener('keydown', this.handleKeydown)
    
    // 添加全局拖拽事件监听器
    document.addEventListener('dragover', this.handleDocumentDragOver)
  },
  beforeUnmount() {
    // 移除事件监听器
    document.removeEventListener('keydown', this.handleKeydown)
    document.removeEventListener('dragover', this.handleDocumentDragOver)
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin: 20px;
}

.game-controls {
  margin-bottom: 20px;
}

.game-controls button {
  margin: 0 10px;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  background-color: #42b983;
  color: white;
  cursor: pointer;
}

.game-controls button:hover {
  background-color: #359c6d;
}

/* 顶部控制区域 */
.top-controls {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.game-table {
  display: inline-block;
  border: 2px solid white;
  border-radius: 10px;
  overflow: hidden;
  margin: 20px 0;
}

.table-header {
  display: flex;
}

.corner-cell {
  background-color: #e0e0e0;
  width: 84px;
  min-height: 60px;
  border: 1px solid white;
  font-weight: bold;
  padding: 10px;
  position: relative;
}

.corner-cell::after {
  content: "出发地/目的地";
  position: absolute;
  top: 0px;
  left: 1px;
  font-size: 12px;
  color: #666;
  z-index: 1;
}

.col-header {
  width: 84px;
  min-height: 80px;
  border: 1px solid white;
  padding: 10px;
  position: relative;
  text-align: left;
  background-color: #f5f5f5;
}

.col-header .header-text {
  position: absolute;
  top: 0px;
  left: 1px;
  font-size: 12px;
  color: #666;
  z-index: 1;
}

.table-row {
  display: flex;
}

.row-header {
  width: 84px;
  min-height: 80px;
  border: 1px solid white;
  padding: 10px;
  position: relative;
  text-align: left;
  background-color: #f5f5f5;
}

.row-header .header-text {
  position: absolute;
  top: 0px;
  left: 1px;
  font-size: 12px;
  color: #666;
  z-index: 1;
}

.table-cell {
  width: 84px;
  min-height: 80px;
  border: 1px solid white;
  padding: 10px;
  position: relative;
  text-align: left;
}

/* 中心区域（工作区/待转区）的特殊背景色 */
.center-zone {
  background-color: #e8f5e9;
}



.players-list {
  display: inline-block;
  margin: 0;
  vertical-align: middle;
}

.players-list .player {
  display: inline-block;
  margin: 0 10px 0 0;
  padding: 8px 12px;
  border: 1px solid white;
  border-radius: 5px;
  background-color: #f5f5f5;
}

.players-list .player button {
  margin-left: 10px;
  padding: 3px 8px;
  border: none;
  border-radius: 3px;
  background-color: #f44336;
  color: white;
  cursor: pointer;
  font-size: 12px;
}

/* 玩家面板区域 */
.player-panels {
  margin: 20px 0;
}

/* 调整弹窗选项布局，使用纯圆点 */
.modal-options-simple {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 20px 0;
}
</style>

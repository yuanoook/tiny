<template>
  <div id="app">
    <h1>卡牌游戏 - 表格布局</h1>
    
    <!-- 游戏控制按钮 -->
    <div class="game-controls">
      <button @click="addPlayer">添加玩家</button>
      <button @click="resetGame">重置游戏</button>
    </div>
    
    <!-- 表格布局的牌堆区域 -->
    <div class="game-table">
      <!-- 表头 -->
      <div class="table-header">
        <div class="corner-cell">
        </div>
        <!-- 新牌堆列 -->
        <div 
          class="col-header" 
          v-for="zone in [baseZones.find(z => z.id === 'deck')]" 
          :key="`col-${zone.id}`"
          @dragover.prevent="handleDragOver"
          @drop="handleDropToHeader(zone.id)"
        >
          <span>{{ zone.name }}</span>
          <!-- 显示在列标题区域的卡牌 -->
          <div 
            class="card-dot header-card" 
            v-for="card in getCardsInColumnHeader(zone.id)" 
            :key="`col-header-${card.id}`"
            :class="[card.isDisguised ? card.disguiseColor : card.color, { 'dragging': isDragging(card), 'disguised': card.isDisguised, 'hidden': card.visibility === 'hidden' }]"
            draggable="true"
            @dragstart="handleDragStart(card, $event)"
            @dragend="handleDragEnd"
            @dblclick="toggleCardDisguise(card)"
          >
          </div>
        </div>
        <!-- 玩家区域列 -->
        <div 
          class="col-header" 
          v-for="player in players" 
          :key="`col-${player.id}`"
          @dragover.prevent="handleDragOver"
          @drop="handleDropToHeader(player.id)"
        >
          <span>{{ player.name }}</span>
          <!-- 显示在列标题区域的卡牌 -->
          <div 
            class="card-dot header-card" 
            v-for="card in getCardsInColumnHeader(player.id)" 
            :key="`col-header-${card.id}`"
            :class="[card.isDisguised ? card.disguiseColor : card.color, { 'dragging': isDragging(card), 'disguised': card.isDisguised, 'hidden': card.visibility === 'hidden' }]"
            draggable="true"
            @dragstart="handleDragStart(card, $event)"
            @dragend="handleDragEnd"
            @dblclick="toggleCardDisguise(card)"
          >
          </div>
        </div>
        <!-- 弃牌堆列 -->
        <div 
          class="col-header" 
          v-for="zone in [baseZones.find(z => z.id === 'discard')]" 
          :key="`col-${zone.id}`"
          @dragover.prevent="handleDragOver"
          @drop="handleDropToHeader(zone.id)"
        >
          <span>{{ zone.name }}</span>
          <!-- 显示在列标题区域的卡牌 -->
          <div 
            class="card-dot header-card" 
            v-for="card in getCardsInColumnHeader(zone.id)" 
            :key="`col-header-${card.id}`"
            :class="[card.isDisguised ? card.disguiseColor : card.color, { 'dragging': isDragging(card), 'disguised': card.isDisguised, 'hidden': card.visibility === 'hidden' }]"
            draggable="true"
            @dragstart="handleDragStart(card, $event)"
            @dragend="handleDragEnd"
            @dblclick="toggleCardDisguise(card)"
          >
          </div>
        </div>
      </div>
      
      <!-- 新牌堆行 -->
      <div class="table-row" v-for="zone in [baseZones.find(z => z.id === 'deck')]" :key="`row-${zone.id}`">
        <div 
          class="row-header" 
          @dragover.prevent="handleDragOver"
          @drop="handleDropToHeader(zone.id)"
        >
          <span>{{ zone.name }}</span>
          <!-- 显示在行标题区域的卡牌 -->
          <div 
            class="card-dot header-card" 
            v-for="card in getCardsInRowHeader(zone.id)" 
            :key="`row-header-${card.id}`"
            :class="[card.isDisguised ? card.disguiseColor : card.color, { 'dragging': isDragging(card), 'disguised': card.isDisguised, 'hidden': card.visibility === 'hidden' }]"
            draggable="true"
            @dragstart="handleDragStart(card, $event)"
            @dragend="handleDragEnd"
            @dblclick="toggleCardDisguise(card)"
          >
          </div>
        </div>
        <!-- 新牌堆到各区域的单元格 -->
        <div 
          class="table-cell" 
          v-for="colZone in [baseZones.find(z => z.id === 'deck'), ...players, baseZones.find(z => z.id === 'discard')]" 
          :key="`${zone.id}-${colZone.id}`"
          :class="{ 'center-zone': isCenterZone(zone.id, colZone.id) }"
          @dragover.prevent="handleDragOver"
          @drop="handleDrop(zone.id, colZone.id)"
        >
          <!-- 显示该区域的卡牌 -->
          <div 
            class="card-dot" 
            v-for="card in getCardsInCell(zone.id, colZone.id)" 
            :key="`${card.id}`"
            :class="[card.isDisguised ? card.disguiseColor : card.color, { 'dragging': isDragging(card), 'disguised': card.isDisguised, 'hidden': card.visibility === 'hidden' }]"
            draggable="true"
            @dragstart="handleDragStart(card, $event)"
            @dragend="handleDragEnd"
            @dblclick="toggleCardDisguise(card)"
          >
          </div>
        </div>
      </div>
      
      <!-- 玩家行 -->
      <div class="table-row" v-for="player in players" :key="`row-${player.id}`">
        <div 
          class="row-header" 
          @dragover.prevent="handleDragOver"
          @drop="handleDropToHeader(player.id)"
        >
          <span>{{ player.name }}</span>
          <!-- 显示在行标题区域的卡牌 -->
          <div 
            class="card-dot header-card" 
            v-for="card in getCardsInRowHeader(player.id)" 
            :key="`row-header-${card.id}`"
            :class="[card.isDisguised ? card.disguiseColor : card.color, { 'dragging': isDragging(card), 'disguised': card.isDisguised, 'hidden': card.visibility === 'hidden' }]"
            draggable="true"
            @dragstart="handleDragStart(card, $event)"
            @dragend="handleDragEnd"
            @dblclick="toggleCardDisguise(card)"
          >
          </div>
        </div>
        <!-- 玩家到各区域的单元格 -->
        <div 
          class="table-cell" 
          v-for="colZone in [baseZones.find(z => z.id === 'deck'), ...players, baseZones.find(z => z.id === 'discard')]" 
          :key="`${player.id}-${colZone.id}`"
          :class="{ 'center-zone': isCenterZone(player.id, colZone.id) }"
          @dragover.prevent="handleDragOver"
          @drop="handleDrop(player.id, colZone.id)"
        >
          <!-- 显示该区域的卡牌 -->
          <div 
            class="card-dot" 
            v-for="card in getCardsInCell(player.id, colZone.id)" 
            :key="`${card.id}`"
            :class="[card.isDisguised ? card.disguiseColor : card.color, { 'dragging': isDragging(card), 'disguised': card.isDisguised, 'hidden': card.visibility === 'hidden' }]"
            draggable="true"
            @dragstart="handleDragStart(card, $event)"
            @dragend="handleDragEnd"
            @dblclick="toggleCardDisguise(card)"
          >
          </div>
        </div>
      </div>
      
      <!-- 弃牌堆行 -->
      <div class="table-row" v-for="zone in [baseZones.find(z => z.id === 'discard')]" :key="`row-${zone.id}`">
        <div 
          class="row-header" 
          @dragover.prevent="handleDragOver"
          @drop="handleDropToHeader(zone.id)"
        >
          <span>{{ zone.name }}</span>
          <!-- 显示在行标题区域的卡牌 -->
          <div 
            class="card-dot header-card" 
            v-for="card in getCardsInRowHeader(zone.id)" 
            :key="`row-header-${card.id}`"
            :class="[card.isDisguised ? card.disguiseColor : card.color, { 'dragging': isDragging(card), 'disguised': card.isDisguised, 'hidden': card.visibility === 'hidden' }]"
            draggable="true"
            @dragstart="handleDragStart(card, $event)"
            @dragend="handleDragEnd"
            @dblclick="toggleCardDisguise(card)"
          >
          </div>
        </div>
        <!-- 弃牌堆到各区域的单元格 -->
        <div 
          class="table-cell" 
          v-for="colZone in [baseZones.find(z => z.id === 'deck'), ...players, baseZones.find(z => z.id === 'discard')]" 
          :key="`${zone.id}-${colZone.id}`"
          :class="{ 'center-zone': isCenterZone(zone.id, colZone.id) }"
          @dragover.prevent="handleDragOver"
          @drop="handleDrop(zone.id, colZone.id)"
        >
          <!-- 显示该区域的卡牌 -->
          <div 
            class="card-dot" 
            v-for="card in getCardsInCell(zone.id, colZone.id)" 
            :key="`${card.id}`"
            :class="[card.isDisguised ? card.disguiseColor : card.color, { 'dragging': isDragging(card), 'disguised': card.isDisguised, 'hidden': card.visibility === 'hidden' }]"
            draggable="true"
            @dragstart="handleDragStart(card, $event)"
            @dragend="handleDragEnd"
            @dblclick="toggleCardDisguise(card)"
          >
          </div>
        </div>
      </div>
    </div>
    
    <!-- 拖拽时跟随鼠标的卡牌 -->
    <div 
      v-if="draggingCard" 
      class="card-dot dragging-card" 
      :class="[
        draggingCard.isDisguised ? draggingCard.disguiseColor : draggingCard.color,
        { 'disguised': draggingCard.isDisguised, 'hidden': draggingCard.visibility === 'hidden' }
      ]"
      :style="draggingCardStyle"
    >
    </div>
    
    <!-- 玩家列表 -->
    <div class="players-list">
      <h3>当前玩家:</h3>
      <div class="player" v-for="player in players" :key="player.id">
        {{ player.name }}
        <button v-if="players.length > 2" @click="removePlayer(player.id)">移除</button>
      </div>
    </div>
    
    <!-- 卡牌操作弹窗 -->
    <div class="modal-overlay" v-if="showCardModal" @click="showCardModal = false">
      <div class="card-modal" @click.stop>
        <div class="modal-options-circles">
          <div class="option-circle" 
               :class="currentCard && currentCard.visibility === 'hidden' ? currentCard.color : 'hidden'"
               @click="toggleCardVisibility">
          </div>
          <div class="option-circle red" @click="setDisguiseColor('red')"></div>
          <div class="option-circle yellow" @click="setDisguiseColor('yellow')"></div>
          <div class="option-circle green" @click="setDisguiseColor('green')"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
      return {
        // 玩家列表
        players: [
          { id: 'player1', name: '玩家1' },
          { id: 'player2', name: '玩家2' }
        ],
        
        // 基础区域
        baseZones: [
          { id: 'deck', name: '新牌堆' },
          { id: 'discard', name: '弃牌堆' }
        ],
        
        // 卡牌数据 (新的设计：owner表示拥有者，to表示目标区域)
        cards: [
          { id: 1, color: 'red', owner: 'deck', visibility: 'hidden' },
          { id: 2, color: 'yellow', owner: 'deck', visibility: 'hidden' },
          { id: 3, color: 'green', owner: 'deck', visibility: 'hidden' },
          { id: 4, color: 'red', owner: 'player1', visibility: 'hidden' },
          { id: 5, color: 'yellow', owner: 'player1', visibility: 'hidden' },
          { id: 6, color: 'green', owner: 'player2', visibility: 'hidden' },
          { id: 7, color: 'red', owner: 'player1', to: 'player2', visibility: 'hidden' },
          { id: 8, color: 'yellow', owner: 'player2', to: 'player1', visibility: 'hidden' }
        ],
        
        // 拖拽状态
        draggingCard: null,
        // 鼠标相对于卡牌左上角的偏移量（固定值，在拖拽开始时计算）
        dragOffsetX: 0,
        dragOffsetY: 0,
        // 拖拽卡牌的当前位置
        dragX: 0,
        dragY: 0,
        
        // 弹窗状态
        showCardModal: false,
        currentCard: null
      };
    },
  computed: {
    // 拖拽卡牌的样式
    draggingCardStyle() {
      return {
        position: 'fixed',
        left: this.dragX + 'px',
        top: this.dragY + 'px',
        pointerEvents: 'none',
        zIndex: 1000,
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        margin: '0'
      };
    },
    
    // 所有区域（新牌堆 + 玩家区域 + 弃牌堆）
    allZones() {
      // 先获取新牌堆
      const deckZone = this.baseZones.find(zone => zone.id === 'deck');
      // 获取弃牌堆
      const discardZone = this.baseZones.find(zone => zone.id === 'discard');
      // 获取玩家区域
      const playerZones = this.players.map(player => ({ id: player.id, name: player.name }));
      
      // 返回排序后的区域：新牌堆 + 玩家区域 + 弃牌堆
      return [
        deckZone,
        ...playerZones,
        discardZone
      ].filter(zone => zone !== undefined);
    }
  },
  mounted() {
    // 添加键盘事件监听器
    document.addEventListener('keydown', this.handleKeydown);
  },
  beforeUnmount() {
    // 移除键盘事件监听器
    document.removeEventListener('keydown', this.handleKeydown);
  },
  methods: {
    // 处理键盘事件
    handleKeydown(event) {
      // 如果按下了ESC键且弹窗是打开的，则关闭弹窗
      if (event.key === 'Escape' && this.showCardModal) {
        this.showCardModal = false;
      }
    },
    // 显示卡牌操作弹窗
    toggleCardDisguise(card) {
      this.currentCard = card;
      this.showCardModal = true;
    },
    
    // 切换卡牌明暗状态
    toggleCardVisibility() {
      if (this.currentCard) {
        // 切换卡牌的可见性
        if (this.currentCard.visibility === 'hidden') {
          // 如果是暗牌，变为明牌
          delete this.currentCard.visibility;
          // 如果之前是伪装牌，取消伪装
          if (this.currentCard.isDisguised) {
            delete this.currentCard.isDisguised;
            delete this.currentCard.disguiseColor;
          }
        } else {
          // 如果是明牌，变为暗牌
          this.currentCard.visibility = 'hidden';
          // 取消伪装状态
          if (this.currentCard.isDisguised) {
            delete this.currentCard.isDisguised;
            delete this.currentCard.disguiseColor;
          }
        }
        this.showCardModal = false;
      }
    },
    
    // 设置卡牌伪装颜色
    setDisguiseColor(color) {
      if (this.currentCard) {
        // 如果点击的是当前伪装颜色，则取消伪装
        if (this.currentCard.isDisguised && this.currentCard.disguiseColor === color) {
          // 取消伪装
          this.currentCard.isDisguised = false;
          delete this.currentCard.disguiseColor;
        } else {
          // 设置伪装状态和颜色
          this.currentCard.isDisguised = true;
          this.currentCard.disguiseColor = color;
          // 如果是明牌，变为暗牌以保持伪装状态
          if (!this.currentCard.visibility) {
            this.currentCard.visibility = 'hidden';
          }
        }
        this.showCardModal = false;
      }
    },
    // 判断是否为中心区域（工作区/待转区）
    isCenterZone(rowZoneId, colZoneId) {
      // 中心区域是所有交叉的格子
      return true;
    },
    
    // 判断卡牌是否正在被拖拽
    isDragging(card) {
      return this.draggingCard && this.draggingCard.id === card.id;
    },
    
    // 获取列标题区域的卡牌（没有to属性的卡牌）
    getCardsInColumnHeader(zoneId) {
      return this.cards.filter(card => 
        card.owner === zoneId && !card.to
      );
    },
    
    // 获取行标题区域的卡牌（没有to属性的卡牌）
    getCardsInRowHeader(zoneId) {
      return this.cards.filter(card => 
        card.owner === zoneId && !card.to
      );
    },
    
    // 获取单元格中的卡牌（有to属性的卡牌）
    getCardsInCell(rowZoneId, colZoneId) {
      return this.cards.filter(card => 
        card.owner === rowZoneId && card.to === colZoneId
      );
    },
    
    // 处理拖拽开始
    handleDragStart(card, event) {
      this.draggingCard = card;
      
      // 计算鼠标相对于卡牌左上角的偏移量
      const rect = event.target.getBoundingClientRect();
      this.dragOffsetX = event.clientX - rect.left;
      this.dragOffsetY = event.clientY - rect.top;
      
      // 设置拖拽卡牌的初始位置
      this.dragX = event.clientX - this.dragOffsetX;
      this.dragY = event.clientY - this.dragOffsetY;
      
      // 添加鼠标移动事件监听器
      document.addEventListener('mousemove', this.handleDocumentDragOver);
    },
    
    // 处理文档拖拽移动
    handleDocumentDragOver(event) {
      // 更新拖拽卡牌的位置，保持鼠标相对于卡牌的偏移量不变
      this.dragX = event.clientX - this.dragOffsetX;
      this.dragY = event.clientY - this.dragOffsetY;
    },
    
    // 处理拖拽结束
    handleDragEnd() {
      this.draggingCard = null;
      
      // 移除鼠标移动事件监听器
      document.removeEventListener('mousemove', this.handleDocumentDragOver);
    },
    
    // 处理拖拽经过
    handleDragOver(event) {
      event.preventDefault();
      this.handleDocumentDragOver(event);
    },
    
    // 处理放置到单元格
    handleDrop(rowZoneId, colZoneId) {
      if (this.draggingCard) {
        // 设置卡牌的目标区域
        this.draggingCard.to = colZoneId;
        this.draggingCard.owner = rowZoneId;
        
        // 重置拖拽状态
        this.draggingCard = null;
        
        // 移除鼠标移动事件监听器
        document.removeEventListener('mousemove', this.handleDocumentDragOver);
      }
    },
    
    // 处理放置到表头
    handleDropToHeader(zoneId) {
      if (this.draggingCard) {
        // 将卡牌放回表头（清除to属性）
        this.draggingCard.to = null;
        this.draggingCard.owner = zoneId;
        
        // 重置拖拽状态
        this.draggingCard = null;
        
        // 移除鼠标移动事件监听器
        document.removeEventListener('mousemove', this.handleDocumentDragOver);
      }
    },
    
    // 添加玩家
    addPlayer() {
      const playerId = `player${this.players.length + 1}`;
      this.players.push({ id: playerId, name: `玩家${this.players.length + 1}` });
    },
    
    // 移除玩家
    removePlayer(playerId) {
      if (this.players.length > 2) {
        this.players = this.players.filter(player => player.id !== playerId);
        
        // 将该玩家的卡牌移至弃牌堆
        this.cards.forEach(card => {
          if (card.owner === playerId) {
            card.owner = 'discard';
          }
          if (card.to === playerId) {
            card.to = null;
          }
        });
      }
    },
    
    // 重置游戏
    resetGame() {
      // 重置卡牌位置
      this.cards.forEach((card, index) => {
        delete card.to; // 清除目标区域
        
        if (index < 3) {
          card.owner = 'deck';
        } else if (index < 5) {
          card.owner = 'player1';
        } else if (index < 6) {
          card.owner = 'player2';
        } else {
          // 重置一些卡牌到中间区域作为示例
          if (index === 6) {
            card.owner = 'player1';
            card.to = 'player2';
          } else if (index === 7) {
            card.owner = 'player2';
            card.to = 'player1';
          }
        }
      });
    }
  }
};
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
  font-weight: bold;
  padding: 10px;
  position: relative;
  background-color: #f5f5f5;
  text-align: left;
}

.col-header span {
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
  background-color: #e0e0e0;
  font-weight: bold;
  width: 84px;
  min-height: 80px;
  border: 1px solid white;
  padding: 10px;
  position: relative;
  text-align: left;
}

.row-header span {
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

/* 头部区域的卡牌样式 */
.header-card {
  width: 15px;
  height: 15px;
  margin: 2px;
  display: inline-block;
}

/* 卡牌小圆点样式 */
.card-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin: 2px;
  margin-bottom: -4px;
  cursor: pointer;
  display: inline-block;
}

.card-dot.red {
  background-color: #ff6b6b;
  border: 2px solid #d32f2f;
}

.card-dot.yellow {
  background-color: #f9c942;
  border: 2px solid #fbc02d;
}

.card-dot.green {
  background-color: #51cf66;
  border: 2px solid #388e3c;
}

/* 伪装卡牌样式 */
.card-dot.disguised {
  position: relative;
}

/* 伪装卡牌的斜纹半透明白色覆盖 */
.card-dot.disguised::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: repeating-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.5),
    rgba(255, 255, 255, 0.5) 2px,
    transparent 2px,
    transparent 4px
  );
  border-radius: 50%;
}

/* 拖拽时隐藏原位置的卡牌 */
.card-dot.dragging {
  opacity: 0;
}

/* 隐藏卡牌样式 */
.card-dot.hidden:not(.disguised) {
  background-color: #9e9e9e;
  border: 2px solid #616161;
}

/* 拖拽时跟随鼠标的卡牌样式 */
.dragging-card {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin: 0;
  cursor: pointer;
  display: inline-block;
}

.players-list {
  margin-top: 20px;
}

.players-list .player {
  display: inline-block;
  margin: 10px;
  padding: 10px;
  border: 1px solid white;
  border-radius: 5px;
}

.players-list .player button {
  margin-left: 10px;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  background-color: #f44336;
  color: white;
  cursor: pointer;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.card-modal {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 300px;
  border: 1px solid white;
}

.card-modal h3 {
  margin-top: 0;
  text-align: center;
}

.modal-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 20px 0;
}

.modal-option {
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid white;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.modal-option:hover {
  background-color: #f5f5f5;
}

.option-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
}

.option-circle.red {
  background-color: #ff6b6b;
  border: 2px solid #d32f2f;
}

.option-circle.yellow {
  background-color: #f9c942;
  border: 2px solid #fbc02d;
}

.option-circle.green {
  background-color: #51cf66;
  border: 2px solid #388e3c;
}

.option-circle.hidden {
  background-color: #9e9e9e;
  border: 2px solid #616161;
}

.option-circle.red {
  background-color: #ff6b6b;
  border: 2px solid #d32f2f;
  position: relative;
}

.option-circle.red::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: repeating-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.5),
    rgba(255, 255, 255, 0.5) 2px,
    transparent 2px,
    transparent 4px
  );
  border-radius: 50%;
}

.option-circle.yellow {
  background-color: #f9c942;
  border: 2px solid #fbc02d;
  position: relative;
}

.option-circle.yellow::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: repeating-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.5),
    rgba(255, 255, 255, 0.5) 2px,
    transparent 2px,
    transparent 4px
  );
  border-radius: 50%;
}

.option-circle.green {
  background-color: #51cf66;
  border: 2px solid #388e3c;
  position: relative;
}

.option-circle.green::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: repeating-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.5),
    rgba(255, 255, 255, 0.5) 2px,
    transparent 2px,
    transparent 4px
  );
  border-radius: 50%;
}

/* 调整弹窗选项布局，使用纯圆点 */
.modal-options-simple {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 20px 0;
}

.modal-options-circles {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 20px 0;
  padding: 10px 0;
}

.modal-options-circles .option-circle {
  width: 40px;
  height: 40px;
  margin: 0;
  cursor: pointer;
}

.modal-options-circles .option-circle:first-child {
  margin-right: 30px;
}

.modal-options-circles .option-circle:first-child::after {
  display: none;
}

.modal-options-circles .option-circle:not(:first-child) {
  margin: 0 5px;
}

.close-button {
  width: 100%;
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.close-button:hover {
  background-color: #359c6d;
}
</style>

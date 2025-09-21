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
          出发地/目的地
        </div>
        <div 
          class="col-header" 
          v-for="zone in allZones" 
          :key="`col-${zone.id}`"
          @dragover.prevent="handleDragOver"
          @drop="handleDropToHeader(zone.id)"
        >
          {{ zone.name }}
          <!-- 显示在列标题区域的卡牌 -->
          <div 
            class="card-dot header-card" 
            v-for="card in getCardsInColumnHeader(zone.id)" 
            :key="`col-header-${card.id}`"
            :class="[card.color, { 'dragging': isDragging(card) }]"
            draggable="true"
            @dragstart="handleDragStart(card, $event)"
            @dragend="handleDragEnd"
          >
          </div>
        </div>
      </div>
      
      <!-- 表格行 -->
      <div class="table-row" v-for="rowZone in allZones" :key="`row-${rowZone.id}`">
        <div 
          class="row-header" 
          @dragover.prevent="handleDragOver"
          @drop="handleDropToHeader(rowZone.id)"
        >
          {{ rowZone.name }}
          <!-- 显示在行标题区域的卡牌 -->
          <div 
            class="card-dot header-card" 
            v-for="card in getCardsInRowHeader(rowZone.id)" 
            :key="`row-header-${card.id}`"
            :class="[card.color, { 'dragging': isDragging(card) }]"
            draggable="true"
            @dragstart="handleDragStart(card, $event)"
            @dragend="handleDragEnd"
          >
          </div>
        </div>
        <div 
          class="table-cell" 
          v-for="colZone in allZones" 
          :key="`${rowZone.id}-${colZone.id}`"
          :class="{ 'center-zone': isCenterZone(rowZone.id, colZone.id) }"
          @dragover.prevent="handleDragOver"
          @drop="handleDrop(rowZone.id, colZone.id)"
        >
          <!-- 显示该区域的卡牌 -->
          <div 
            class="card-dot" 
            v-for="card in getCardsInCell(rowZone.id, colZone.id)" 
            :key="`${card.id}`"
            :class="[card.color, { 'dragging': isDragging(card) }]"
            draggable="true"
            @dragstart="handleDragStart(card, $event)"
            @dragend="handleDragEnd"
          >
          </div>
        </div>
      </div>
    </div>
    
    <!-- 拖拽时跟随鼠标的卡牌 -->
    <div 
      v-if="draggingCard" 
      class="card-dot dragging-card" 
      :class="draggingCard.color"
      :style="draggingCardStyle"
    >
    </div>
    
    <!-- 玩家列表 -->
    <div class="players-list">
      <h3>当前玩家:</h3>
      <div class="player" v-for="player in players" :key="player.id">
        {{ player.name }}
        <button @click="removePlayer(player.id)">移除</button>
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
          { id: 1, color: 'red', owner: 'deck' },
          { id: 2, color: 'yellow', owner: 'deck' },
          { id: 3, color: 'green', owner: 'deck' },
          { id: 4, color: 'red', owner: 'player1' },
          { id: 5, color: 'yellow', owner: 'player1' },
          { id: 6, color: 'green', owner: 'player2' },
          { id: 7, color: 'red', owner: 'player1', to: 'player2' },
          { id: 8, color: 'yellow', owner: 'player2', to: 'player1' }
        ],
        
        // 拖拽状态
        draggingCard: null,
        // 鼠标相对于卡牌左上角的偏移量（固定值，在拖拽开始时计算）
        dragOffsetX: 0,
        dragOffsetY: 0,
        // 拖拽卡牌的当前位置
        dragX: 0,
        dragY: 0
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
    
    // 所有区域（基础区域+玩家区域）
    allZones() {
      return [
        ...this.baseZones,
        ...this.players.map(player => ({ id: player.id, name: player.name }))
      ];
    }
  },
  methods: {
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
  border: 2px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  margin: 20px 0;
}

.table-header {
  display: flex;
}

.corner-cell {
  background-color: #e0e0e0;
  width: 120px;
  min-height: 60px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  font-weight: bold;
  padding: 10px;
  position: relative;
}

.col-header {
  width: 120px;
  min-height: 60px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  font-weight: bold;
  padding: 10px;
  position: relative;
  background-color: #f5f5f5;
}

.table-row {
  display: flex;
}

.row-header {
  background-color: #e0e0e0;
  font-weight: bold;
  width: 120px;
  min-height: 80px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  padding: 10px;
  position: relative;
}

.table-cell {
  width: 120px;
  min-height: 80px;
  border: 1px solid #ddd;
  padding: 10px;
  position: relative;
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
}

/* 卡牌小圆点样式 */
.card-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin: 5px;
  cursor: pointer;
  display: inline-block;
}

.card-dot.red {
  background-color: #f44336;
  border: 2px solid #d32f2f;
}

.card-dot.yellow {
  background-color: #ffeb3b;
  border: 2px solid #fbc02d;
}

.card-dot.green {
  background-color: #4caf50;
  border: 2px solid #388e3c;
}

/* 拖拽时隐藏原位置的卡牌 */
.card-dot.dragging {
  opacity: 0;
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
  border: 1px solid #ddd;
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
</style>

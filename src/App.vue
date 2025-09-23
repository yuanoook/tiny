<template>
  <div id="app">
    <h1>卡牌游戏 - 表格布局</h1>
    
    <!-- 顶部控制区域 -->
    <div class="top-controls">
      <!-- 游戏控制按钮 -->
      <div class="game-controls">
        <button @click="addPlayer">添加玩家</button>
        <button @click="resetGame">重置游戏</button>
        
        <!-- 玩家列表 -->
        <div class="players-list">
          <div class="player" v-for="player in players" :key="player.id">
            {{ player.name }}
            <button v-if="players.length > 2" @click="removePlayer(player.id)">移除</button>
          </div>
        </div>
      </div>
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
          <span class="header-text">{{ zone.name }}</span>
          <!-- 显示在列标题区域的卡牌 -->
          <CardDot
            v-for="(card, index) in getCardsInColumnHeader(zone.id)" 
            :key="`col-header-${card.id}`"
            :card="card"
            :is-dragging="isDragging(card)"
            :is-header-card="true"
            :is-deck-header-card="(zone.id === 'deck' || zone.id === 'discard')"
            :card-style="(zone.id === 'deck' || zone.id === 'discard') ? { 
              position: 'absolute',
              left: `${5 + (index * 15) % 69}px`,
              top: `${5 + Math.floor(index / 5) * 15 % 65}px`,
              zIndex: index
            } : {}"
            @dragstart="handleDragStart(card, $event)"
            @dragend="handleDragEnd"
            @doubleclick="toggleCardDisguise"
          />
        </div>
        <!-- 玩家区域列 -->
        <div 
          class="col-header" 
          v-for="player in players" 
          :key="`col-${player.id}`"
          @dragover.prevent="handleDragOver"
          @drop="handleDropToHeader(player.id)"
        >
          <span class="header-text">{{ player.name }}</span>
          <!-- 显示在列标题区域的卡牌 -->
          <CardDot
            v-for="(card, index) in getCardsInColumnHeader(player.id)" 
            :key="`col-header-${card.id}`"
            :card="card"
            :is-dragging="isDragging(card)"
            :is-header-card="true"
            @dragstart="handleDragStart(card, $event)"
            @dragend="handleDragEnd"
            @doubleclick="toggleCardDisguise"
          />
        </div>
        <!-- 弃牌堆列 -->
        <div 
          class="col-header" 
          v-for="zone in [baseZones.find(z => z.id === 'discard')]" 
          :key="`col-${zone.id}`"
          @dragover.prevent="handleDragOver"
          @drop="handleDropToHeader(zone.id)"
        >
          <span class="header-text">{{ zone.name }}</span>
          <!-- 显示在列标题区域的卡牌 -->
          <CardDot
            v-for="(card, index) in getCardsInColumnHeader(zone.id)" 
            :key="`col-header-${card.id}`"
            :card="card"
            :is-dragging="isDragging(card)"
            :is-header-card="true"
            :is-deck-header-card="(zone.id === 'deck' || zone.id === 'discard')"
            :card-style="(zone.id === 'deck' || zone.id === 'discard') ? { 
              position: 'absolute',
              left: `${5 + (index * 15) % 69}px`,
              top: `${5 + Math.floor(index / 5) * 15 % 65}px`,
              zIndex: index
            } : {}"
            @dragstart="handleDragStart(card, $event)"
            @dragend="handleDragEnd"
            @doubleclick="toggleCardDisguise"
          />
        </div>
      </div>
      
      <!-- 新牌堆行 -->
      <div class="table-row" v-for="zone in [baseZones.find(z => z.id === 'deck')]" :key="`row-${zone.id}`">
        <div 
          class="row-header" 
          @dragover.prevent="handleDragOver"
          @drop="handleDropToHeader(zone.id)"
        >
          <span class="header-text">{{ zone.name }}</span>
          <!-- 显示在行标题区域的卡牌 -->
          <CardDot
            v-for="(card, index) in getCardsInRowHeader(zone.id)" 
            :key="`row-header-${card.id}`"
            :card="card"
            :is-dragging="isDragging(card)"
            :is-header-card="true"
            :is-deck-header-card="(zone.id === 'deck' || zone.id === 'discard')"
            :card-style="(zone.id === 'deck' || zone.id === 'discard') ? { 
              position: 'absolute',
              left: `${5 + (index * 15) % 69}px`,
              top: `${5 + Math.floor(index / 5) * 15 % 65}px`,
              zIndex: index
            } : {}"
            @dragstart="handleDragStart(card, $event)"
            @dragend="handleDragEnd"
            @doubleclick="toggleCardDisguise"
          />
        </div>
        <!-- 新牌堆到各区域的单元格 -->
        <div 
          class="table-cell" 
          v-for="colZone in [baseZones.find(z => z.id === 'deck'), ...players, baseZones.find(z => z.id === 'discard')]" 
          :key="`${zone.id}-${colZone.id}`"
          :class="[`cell-${zone.id}-${colZone.id}`, { 'center-zone': isCenterZone(zone.id, colZone.id), 'deck-cell': zone.id === 'deck', 'discard-cell': zone.id === 'discard' }]"
          @dragover.prevent="handleDragOver"
          @drop="handleDrop(zone.id, colZone.id)"
        >
          <!-- 显示该区域的卡牌 -->
          <CardDot
            v-for="(card, index) in getCardsInCell(zone.id, colZone.id)" 
            :key="`${card.id}`"
            :card="card"
            :is-dragging="isDragging(card)"
            :is-deck-card="(zone.id === 'deck' || zone.id === 'discard') && (colZone.id === 'deck' || colZone.id === 'discard')"
            :card-style="(zone.id === 'deck' || zone.id === 'discard') && (colZone.id === 'deck' || colZone.id === 'discard') ? { 
              position: 'absolute',
              left: `${5 + (index * 15) % 69}px`,
              top: `${5 + Math.floor(index / 5) * 15 % 65}px`,
              zIndex: index
            } : {}"
            @dragstart="handleDragStart(card, $event)"
            @dragend="handleDragEnd"
            @doubleclick="toggleCardDisguise(card)"
          />
        </div>
      </div>
      
      <!-- 玩家行 -->
      <div class="table-row" v-for="player in players" :key="`row-${player.id}`">
        <div 
          class="row-header" 
          @dragover.prevent="handleDragOver"
          @drop="handleDropToHeader(player.id)"
        >
          <span class="header-text">{{ player.name }}</span>
          <!-- 显示在行标题区域的卡牌 -->
          <CardDot
            v-for="(card, index) in getCardsInRowHeader(player.id)" 
            :key="`row-header-${card.id}`"
            :card="card"
            :is-dragging="isDragging(card)"
            :is-header-card="true"
            @dragstart="handleDragStart(card, $event)"
            @dragend="handleDragEnd"
            @doubleclick="toggleCardDisguise"
          />
        </div>
        <!-- 玩家到各区域的单元格 -->
        <div 
          class="table-cell" 
          v-for="colZone in [baseZones.find(z => z.id === 'deck'), ...players, baseZones.find(z => z.id === 'discard')]" 
          :key="`${player.id}-${colZone.id}`"
          :class="[`cell-${player.id}-${colZone.id}`, { 'center-zone': isCenterZone(player.id, colZone.id) }]"
          @dragover.prevent="handleDragOver"
          @drop="handleDrop(player.id, colZone.id)"
        >
          <!-- 显示该区域的卡牌 -->
          <CardDot
            v-for="(card, index) in getCardsInCell(player.id, colZone.id)" 
            :key="`${card.id}`"
            :card="card"
            :is-dragging="isDragging(card)"
            @dragstart="handleDragStart(card, $event)"
            @dragend="handleDragEnd"
            @doubleclick="toggleCardDisguise(card)"
          />
        </div>
      </div>
      
      <!-- 弃牌堆行 -->
      <div class="table-row" v-for="zone in [baseZones.find(z => z.id === 'discard')]" :key="`row-${zone.id}`">
        <div 
          class="row-header" 
          @dragover.prevent="handleDragOver"
          @drop="handleDropToHeader(zone.id)"
        >
          <span class="header-text">{{ zone.name }}</span>
          <!-- 显示在行标题区域的卡牌 -->
          <CardDot
            v-for="(card, index) in getCardsInRowHeader(zone.id)" 
            :key="`row-header-${card.id}`"
            :card="card"
            :is-dragging="isDragging(card)"
            :is-header-card="true"
            :is-deck-header-card="(zone.id === 'deck' || zone.id === 'discard')"
            :card-style="(zone.id === 'deck' || zone.id === 'discard') ? { 
              position: 'absolute',
              left: `${5 + (index * 15) % 69}px`,
              top: `${5 + Math.floor(index / 5) * 15 % 65}px`,
              zIndex: index
            } : {}"
            @dragstart="handleDragStart(card, $event)"
            @dragend="handleDragEnd"
            @doubleclick="toggleCardDisguise"
          />
        </div>
        <!-- 弃牌堆到各区域的单元格 -->
        <div 
          class="table-cell" 
          v-for="colZone in [baseZones.find(z => z.id === 'deck'), ...players, baseZones.find(z => z.id === 'discard')]" 
          :key="`${zone.id}-${colZone.id}`"
          :class="[`cell-${zone.id}-${colZone.id}`, { 'center-zone': isCenterZone(zone.id, colZone.id), 'deck-cell': zone.id === 'deck', 'discard-cell': zone.id === 'discard' }]"
          @dragover.prevent="handleDragOver"
          @drop="handleDrop(zone.id, colZone.id)"
        >
          <!-- 显示该区域的卡牌 -->
          <CardDot
            v-for="(card, index) in getCardsInCell(zone.id, colZone.id)" 
            :key="`${card.id}`"
            :card="card"
            :is-dragging="isDragging(card)"
            :is-deck-card="(zone.id === 'deck' || zone.id === 'discard') && (colZone.id === 'deck' || colZone.id === 'discard')"
            :card-style="(zone.id === 'deck' || zone.id === 'discard') && (colZone.id === 'deck' || colZone.id === 'discard') ? { 
              position: 'absolute',
              left: `${5 + (index * 15) % 69}px`,
              top: `${5 + Math.floor(index / 5) * 15 % 65}px`,
              zIndex: index
            } : {}"
            @dragstart="handleDragStart(card, $event)"
            @dragend="handleDragEnd"
            @doubleclick="toggleCardDisguise"
          />
        </div>
      </div>
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
import { 
  initializePlayers, 
  generateInitialCards, 
  addEmptyCardsForPlayers,
  getAllZones,
  getCardsInColumnHeader,
  getCardsInRowHeader,
  getCardsInCell,
  getCardIndex,
  isCenterZone,
  handleRemovePlayerCards,
  createNewCard,
  createPrototypeEmptyCard
} from './gameState.js';
import CardModal from './components/CardModal.vue';
import CardDot from './components/CardDot.vue';

export default {
  name: "App",
  components: {
    CardModal,
    CardDot
  },
  data() {
      // 初始化玩家列表
      const players = initializePlayers();
      
      // 生成初始卡牌数据
      let cards = generateInitialCards();
      
      // 为每个玩家生成一张empty卡牌，并标记为第一个空心牌
      cards = addEmptyCardsForPlayers(players, cards);
      
      return {
        // 玩家列表
        players: players,
        
        // 基础区域
        baseZones: [
          { id: 'deck', name: '新牌堆' },
          { id: 'discard', name: '弃牌堆' }
        ],
        
        // 卡牌数据 (新的设计：owner表示拥有者，to表示目标区域)
        cards: cards,
        
        // 全局ID计数器
        nextGlobalId: 61, // 初始值设为61，与现有卡牌ID不冲突
        
        // 拖拽状态
        draggingCard: null,
        originalDraggingCard: null, // 保存原始拖拽卡牌的引用
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
        margin: '0',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        transform: 'scale(1.1)'
      };
    },
    
    // 所有区域（新牌堆 + 玩家区域 + 弃牌堆）
    allZones() {
      return getAllZones(this.baseZones, this.players);
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
        // 如果是empty卡牌且还没有设置伪装颜色，则设置伪装颜色
        if (this.currentCard.isEmpty && !this.currentCard.disguiseColor) {
          this.currentCard.disguiseColor = color;
          this.currentCard.isDisguised = true; // 确保设置为伪装状态
        }
        // 如果卡牌已经是该颜色的伪装，则取消伪装
        else if (this.currentCard.isDisguised && this.currentCard.disguiseColor === color) {
          this.currentCard.isDisguised = false;
          this.currentCard.disguiseColor = null;
        } else {
          // 设置新的伪装颜色
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
      return isCenterZone(rowZoneId, colZoneId);
    },
    
    // 判断卡牌是否正在被拖拽
    isDragging(card) {
      // 如果有正在拖拽的卡牌，直接比较ID
      if (this.draggingCard && this.draggingCard.id === card.id) {
        return true;
      }
      
      // 如果是原型卡牌，还需要检查是否是原始拖拽卡牌
      if (card.isPrototype && this.originalDraggingCard && this.originalDraggingCard.id === card.id) {
        return true;
      }
      
      return false;
    },
    
    // 获取列标题区域的卡牌（没有to属性的卡牌）
    getCardsInColumnHeader(zoneId) {
      return getCardsInColumnHeader(this.cards, zoneId);
    },
    
    // 获取行标题区域的卡牌（没有to属性的卡牌）
    getCardsInRowHeader(zoneId) {
      return getCardsInRowHeader(this.cards, zoneId);
    },
    
    // 获取单元格中的卡牌（有to属性的卡牌）
    getCardsInCell(rowZoneId, colZoneId) {
      return getCardsInCell(this.cards, rowZoneId, colZoneId);
    },
    
    // 处理拖拽开始
    handleDragStart(card, event) {
      // 如果是原型空心牌，则创建一个新的卡牌实例
      if (card.isPrototype) {
        // 创建新卡牌，继承原始卡牌的部分属性
        const newCard = {
          ...card,
          id: `drag-${Date.now()}`, // 为拖拽中的卡牌创建唯一ID
          isPrototype: false, // 拖拽中的卡牌不是原型
          // 重置拖拽相关属性
          owner: card.owner,
          to: null,
          visibility: 'hidden',
          isEmpty: true,
          color: card.isDisguised ? card.disguiseColor : 'empty',
          isDisguised: card.isDisguised || false,
          disguiseColor: card.disguiseColor || null
        };
        
        this.originalDraggingCard = card; // 保存原始卡牌引用
        this.draggingCard = newCard; // 设置拖拽中的卡牌
      } else {
        this.originalDraggingCard = null; // 非原型卡牌不需要保存原始引用
        this.draggingCard = card; // 直接使用原卡牌作为拖拽卡牌
      }

      // 计算鼠标相对于卡牌左上角的偏移量
      const rect = event.target.getBoundingClientRect();
      this.dragOffsetX = event.clientX - rect.left;
      this.dragOffsetY = event.clientY - rect.top;
      
      // 添加鼠标移动事件监听器
      document.addEventListener('mousemove', this.handleDocumentDragOver);
      
      // 阻止默认的拖拽行为
      event.preventDefault();
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
        console.log('Dropping card to cell:', this.draggingCard);
        console.log('Cards count before drop:', this.cards.length);
        // 保存原始拖拽卡牌的引用
        const originalDraggingCard = this.originalDraggingCard || this.draggingCard;
        
        // 只有原型空心牌才能创建新卡牌
        if (originalDraggingCard.isPrototype) {
          // 创建新卡牌
          const newCard = createNewCard(this.nextGlobalId++, rowZoneId, colZoneId);
          
          console.log('Creating new empty card:', newCard);
          // 添加新卡牌到cards数组
          this.cards.push(newCard);
          console.log('Cards count after adding new card:', this.cards.length);
        }
        
        // 设置卡牌的目标区域
        this.draggingCard.to = colZoneId;
        this.draggingCard.owner = rowZoneId;
        
        // 重置拖拽状态
        this.draggingCard = null;
        this.originalDraggingCard = null;
        
        // 移除鼠标移动事件监听器
        document.removeEventListener('mousemove', this.handleDocumentDragOver);
      }
    },
    
    // 处理放置到表头
    handleDropToHeader(zoneId) {
      if (this.draggingCard) {
        console.log('Dropping card to header:', this.draggingCard);
        console.log('Cards count before drop:', this.cards.length);
        // 保存原始拖拽卡牌的引用
        const originalDraggingCard = this.originalDraggingCard || this.draggingCard;
        
        // 只有原型空心牌才能创建新卡牌
        if (originalDraggingCard.isPrototype) {
          // 创建新卡牌
          const newCard = createNewCard(this.nextGlobalId++, zoneId);
          
          console.log('Creating new empty card:', newCard);
          // 添加新卡牌到cards数组
          this.cards.push(newCard);
          console.log('Cards count after adding new card:', this.cards.length);
        }
        
        // 将卡牌放回表头（清除to属性）
        this.draggingCard.to = null;
        this.draggingCard.owner = zoneId;
        
        // 重置拖拽状态
        this.draggingCard = null;
        this.originalDraggingCard = null;
        
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
        this.cards = handleRemovePlayerCards(this.cards, playerId);
      }
    },
    
    // 重置游戏
    resetGame() {
      // 重新生成60张随机分布的卡牌
      this.cards = this.generateInitialCards();
    },
    // 生成初始卡牌数据
    generateInitialCards() {
      return generateInitialCards();
    },
    
    // 获取卡牌在cards数组中的索引
    getCardIndex(card) {
      return getCardIndex(this.cards, card);
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

/* 调整弹窗选项布局，使用纯圆点 */
.modal-options-simple {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 20px 0;
}
</style>

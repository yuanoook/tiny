<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ playerLabel }}的手牌 ({{ handCards.length }}张)</h2>
        <button class="close-button" @click="closeModal">×</button>
      </div>
      
      <div class="modal-body">
        <div v-if="handCards.length === 0" class="empty-hand">
          <p>没有手牌</p>
        </div>
        
        <div v-else class="hand-cards">
          <CardComponent
            v-for="card in handCards"
            :key="card.id"
            :card="card"
            :is-selected="card.id === selectedCardId"
            :is-folded="false"
            @click="handleCardClick(card)"
            @drag-start="handleCardDragStart"
          />
        </div>
      </div>
      
      <!-- 明牌/暗牌选择界面 -->
      <div v-if="selectedCard && showPlayTypeSelection" class="play-type-selection">
        <h3>选择出牌方式</h3>
        <div class="play-type-options">
          <button @click="playCardAsVisible" class="play-type-button visible">
            明牌出牌
          </button>
          <button @click="showHiddenCardSelection" class="play-type-button hidden">
            暗牌出牌
          </button>
        </div>
      </div>
      
      <!-- 暗牌类型选择界面 -->
      <div v-if="selectedCard && showHiddenCardTypeSelection" class="hidden-card-type-selection">
        <h3>选择暗牌类型</h3>
        <div class="card-type-options">
          <button 
            v-for="type in cardTypes" 
            :key="type.value"
            @click="playCardAsHidden(type.value)"
            class="card-type-button"
            :class="type.value"
          >
            {{ type.label }}
          </button>
        </div>
        <button @click="backToPlayTypeSelection" class="back-button">返回</button>
      </div>
      
      <div class="modal-footer">
        <button 
          v-if="selectedCard && canPlayCard && !showPlayTypeSelection && !showHiddenCardTypeSelection" 
          @click="showPlayTypeOptions"
          class="play-button"
        >
          {{ playButtonText }}
        </button>
        <button @click="closeModal" class="cancel-button">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>
import CardComponent from './CardComponent.vue';

export default {
  name: "HandCardsModal",
  components: {
    CardComponent
  },
  props: {
    playerId: {
      type: String,
      required: true
    },
    handCards: {
      type: Array,
      default: () => []
    },
    currentPhase: {
      type: String,
      required: true
    },
    currentPlayer: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      selectedCardId: null,
      showPlayTypeSelection: false,
      showHiddenCardTypeSelection: false,
      cardTypes: [
        { value: 'eat', label: '吃饭卡' },
        { value: 'stop', label: '停止卡' },
        { value: 'cash', label: '现金卡' }
      ]
    };
  },
  computed: {
    playerLabel() {
      return this.playerId === 'player1' ? '玩家1' : '玩家2';
    },
    selectedCard() {
      return this.handCards.find(card => card.id === this.selectedCardId);
    },
    canPlayCard() {
      // 检查是否可以出牌
      if (!this.selectedCard) return false;
      
      // 只有当前玩家可以操作自己的手牌
      if (this.selectedCard.owner !== this.currentPlayer) return false;
      
      // 根据当前阶段决定是否可以出牌
      switch (this.currentPhase) {
        case 'play':
          return true;
        case 'battle':
          return true;
        case 'discard':
          return true;
        default:
          return false;
      }
    },
    playButtonText() {
      switch (this.currentPhase) {
        case 'play':
          return '出牌到弃牌堆';
        case 'battle':
          return '出牌到对战区';
        case 'discard':
          return '弃牌';
        default:
          return '出牌';
      }
    }
  },
  methods: {
    handleCardClick(card) {
      // 只能操作当前玩家的卡牌
      if (card.owner !== this.currentPlayer) return;
      
      // 如果当前是battle阶段，自动出牌到对战区
      if (this.currentPhase === 'battle') {
        // 直接出牌到对战区，作为进攻方
        this.$emit('play-card', {
          cardId: card.id,
          playType: 'battle',
          playerId: this.currentPlayer,
          visibility: 'visible'
        });
        
        // 关闭弹窗
        this.closeModal();
      } else {
        // 否则使用原来的选择逻辑
        this.selectCard(card);
      }
    },
    selectCard(card) {
      // 只能选择当前玩家的卡牌
      if (card.owner !== this.currentPlayer) return;
      
      if (this.selectedCardId === card.id) {
        this.selectedCardId = null;
        this.showPlayTypeSelection = false;
        this.showHiddenCardTypeSelection = false;
      } else {
        this.selectedCardId = card.id;
        this.showPlayTypeSelection = false;
        this.showHiddenCardTypeSelection = false;
      }
    },
    showPlayTypeOptions() {
      if (!this.selectedCard) return;
      this.showPlayTypeSelection = true;
      this.showHiddenCardTypeSelection = false;
    },
    playCardAsVisible() {
      if (!this.selectedCard) return;
      
      // 设置为明牌
      this.setCardVisibility(this.selectedCard.id, 'visible');
      
      // 根据当前阶段决定出牌方式
      let playType = '';
      switch (this.currentPhase) {
        case 'play':
          playType = 'discard';
          break;
        case 'battle':
          playType = 'battle';
          break;
        case 'discard':
          playType = 'discard';
          break;
      }
      
      this.$emit('play-card', {
        cardId: this.selectedCard.id,
        playType: playType,
        playerId: this.currentPlayer,
        visibility: 'visible'
      });
      
      // 重置选中状态
      this.selectedCardId = null;
      this.showPlayTypeSelection = false;
    },
    showHiddenCardSelection() {
      if (!this.selectedCard) return;
      this.showPlayTypeSelection = false;
      this.showHiddenCardTypeSelection = true;
    },
    backToPlayTypeSelection() {
      this.showPlayTypeSelection = true;
      this.showHiddenCardTypeSelection = false;
    },
    playCardAsHidden(cardType) {
      if (!this.selectedCard) return;
      
      // 设置为暗牌
      this.setCardVisibility(this.selectedCard.id, 'hidden');
      
      // 根据当前阶段决定出牌方式
      let playType = '';
      switch (this.currentPhase) {
        case 'play':
          playType = 'discard';
          break;
        case 'battle':
          playType = 'battle';
          break;
        case 'discard':
          playType = 'discard';
          break;
      }
      
      this.$emit('play-card', {
        cardId: this.selectedCard.id,
        playType: playType,
        playerId: this.currentPlayer,
        visibility: 'hidden',
        hiddenCardType: cardType
      });
      
      // 重置选中状态
      this.selectedCardId = null;
      this.showHiddenCardTypeSelection = false;
    },
    setCardVisibility(cardId, visibility) {
      // 这里可以调用gameState的方法来设置卡牌可见性
      // 暂时只是在组件内部处理
      console.log(`设置卡牌 ${cardId} 的可见性为 ${visibility}`);
    },
    closeModal() {
      this.$emit('close');
      // 重置所有状态
      this.selectedCardId = null;
      this.showPlayTypeSelection = false;
      this.showHiddenCardTypeSelection = false;
    },
    handleCardDragStart(card) {
      // 将拖拽事件传递给父组件
      this.$emit('card-drag-start', card);
    }
  }
};
</script>

<style scoped>
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

.modal-content {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  width: 80%;
  max-width: 800px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

.empty-hand {
  text-align: center;
  padding: 40px;
  color: #999;
}

.hand-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.play-type-selection, .hidden-card-type-selection {
  padding: 20px;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.play-type-selection h3, .hidden-card-type-selection h3 {
  text-align: center;
  margin-top: 0;
  color: #333;
}

.play-type-options, .card-type-options {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
}

.play-type-button, .card-type-button {
  padding: 15px 25px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.play-type-button.visible {
  background-color: #42b983;
  color: white;
}

.play-type-button.visible:hover {
  background-color: #359c6d;
}

.play-type-button.hidden {
  background-color: #ff9800;
  color: white;
}

.play-type-button.hidden:hover {
  background-color: #e68a00;
}

.card-type-button {
  min-width: 120px;
  padding: 15px 10px;
}

.card-type-button.eat {
  background-color: #ffecb3;
  border: 2px solid #ffc107;
  color: #333;
}

.card-type-button.eat:hover {
  background-color: #ffd54f;
}

.card-type-button.stop {
  background-color: #ffcdd2;
  border: 2px solid #f44336;
  color: #333;
}

.card-type-button.stop:hover {
  background-color: #ef9a9a;
}

.card-type-button.cash {
  background-color: #c8e6c9;
  border: 2px solid #4caf50;
  color: #333;
}

.card-type-button.cash:hover {
  background-color: #a5d6a7;
}

.back-button {
  display: block;
  margin: 20px auto 0;
  padding: 10px 20px;
  background-color: #f0f0f0;
  color: #333;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.back-button:hover {
  background-color: #e0e0e0;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.play-button {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.play-button:hover {
  background-color: #359c6d;
}

.play-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.cancel-button {
  padding: 10px 20px;
  background-color: #f0f0f0;
  color: #333;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.cancel-button:hover {
  background-color: #e0e0e0;
}
</style>
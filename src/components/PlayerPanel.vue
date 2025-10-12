<template>
  <div class="player-panel" :class="{ 'active-player': isActive }">
    <div class="player-header">
      <h3>{{ player.name }}</h3>
      <div class="card-count">卡牌数量: {{ playerCards.length }}</div>
    </div>
    
    <!-- 玩家的手牌区域 - 明牌展开显示 -->
    <div class="player-hand">
      <CardDot
        v-for="card in visibleCards"
        :key="`player-card-${card.id}`"
        :card="card"
        :is-deck-card="false"
        @doubleclick="onCardDoubleClick"
        @dragstart="onCardDragStart(card, $event)"
        @dragend="onCardDragEnd"
      />
    </div>
    
    <!-- 玩家的隐藏牌区域 -->
    <div class="player-hidden-cards" v-if="hiddenCards.length > 0">
      <div class="hidden-cards-label">隐藏卡牌:</div>
      <CardDot
        v-for="card in hiddenCards"
        :key="`player-hidden-card-${card.id}`"
        :card="card"
        :is-deck-card="false"
        @doubleclick="onCardDoubleClick"
        @dragstart="onCardDragStart(card, $event)"
        @dragend="onCardDragEnd"
      />
    </div>
  </div>
</template>

<script>
import CardDot from './CardDot.vue';

export default {
  name: "PlayerPanel",
  components: {
    CardDot
  },
  props: {
    player: {
      type: Object,
      required: true
    },
    cards: {
      type: Array,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    },
    handleDragStart: {
      type: Function,
      required: true
    },
    handleDragEnd: {
      type: Function,
      required: true
    }
  },
  computed: {
    // 获取该玩家的所有卡牌
    playerCards() {
      return this.cards.filter(card => card.owner === this.player.id);
    },
    
    // 获取该玩家的可见卡牌（非隐藏状态）
    visibleCards() {
      return this.playerCards.filter(card => card.visibility !== 'hidden');
    },
    
    // 获取该玩家的隐藏卡牌
    hiddenCards() {
      return this.playerCards.filter(card => card.visibility === 'hidden');
    }
  },
  methods: {
    onCardDoubleClick(card) {
      // 将双击事件传递给父组件处理
      this.$emit('card-double-click', card);
    },
    
    onCardDragStart(card, event) {
      // 将拖拽事件传递给父组件处理
      this.handleDragStart(card, event);
    },
    
    onCardDragEnd(event) {
      // 将拖拽结束事件传递给父组件处理
      this.handleDragEnd(event);
    }
  }
}
</script>

<style scoped>
.player-panel {
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  padding: 15px;
  margin: 10px 0;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.player-panel.active-player {
  border-color: #42b983;
  background-color: #f0f9f5;
}

.player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.player-header h3 {
  margin: 0;
  color: #333;
}

.card-count {
  font-size: 14px;
  color: #666;
}

.player-hand {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  min-height: 60px;
  padding: 10px;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #eee;
  margin-bottom: 15px;
}

.player-hidden-cards {
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 8px;
  border: 1px solid #eee;
}

.hidden-cards-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.player-hidden-cards .card-dot {
  opacity: 0.7;
}
</style>
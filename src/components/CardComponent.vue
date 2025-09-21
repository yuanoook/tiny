<template>
  <div 
    class="card-wrapper"
    :class="{ selected: card.isSelected, disabled: isDisabled, folded: isFolded }"
    @click="!isDisabled && $emit('click')"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <div class="card" :class="[card.type, card.visibility]">
      <div class="card-content">
        <img 
          :src="getCardImage(card.type)" 
          :alt="card.name" 
          class="card-image" 
        />
        <h3>{{ card.name }}</h3>
        <p>{{ card.description }}</p>
        <div class="card-status">
          <span class="status-item">状态: {{ getCardStateText(card.state) }}</span>
          <span class="status-item">可见性: {{ card.visibility === 'visible' ? '明牌' : '暗牌' }}</span>
        </div>
      </div>
    </div>
    <!-- 折叠边缘指示器 -->
    <div v-if="isFolded" class="fold-indicator" :class="card.type"></div>
  </div>
</template>

<script>
export default {
  name: "CardComponent",
  props: {
    card: {
      type: Object,
      required: true
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isFolded: {
      type: Boolean,
      default: false
    },
    isSelected: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click', 'drag-start', 'drag-end'],
  methods: {
    getCardImage(type) {
      try {
        return new URL(`../assets/${type}.png`, import.meta.url).href;
      } catch (error) {
        return '';
      }
    },
    getCardStateText(state) {
      const stateMap = {
        'deck': '牌堆',
        'player1': '玩家1',
        'player2': '玩家2',
        'discard': '弃牌堆',
        'selected': '已选中'
      };
      return stateMap[state] || state;
    },
    handleDragStart(event) {
      // 设置拖拽数据
      event.dataTransfer.setData('text/plain', JSON.stringify({
        cardId: this.card.id,
        cardState: this.card.state,
        cardOwner: this.card.owner
      }));
      
      // 设置拖拽效果
      event.dataTransfer.effectAllowed = 'move';
      
      // 触发父组件的拖拽开始事件
      this.$emit('drag-start', this.card);
    },
    handleDragEnd(event) {
      // 触发父组件的拖拽结束事件
      this.$emit('drag-end', this.card);
    }
  }
};
</script>

<style scoped>
.card-wrapper {
  transition: transform 0.2s ease;
  position: relative;
}

.card-wrapper:hover:not(.disabled):not(.folded) {
  transform: translateY(-5px);
  cursor: pointer;
}

.card-wrapper.selected {
  transform: translateY(-10px);
  box-shadow: 0 0 15px rgba(66, 185, 131, 0.8);
}

.card-wrapper.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.card-wrapper.folded {
  width: 30px;
  height: 42px;
  cursor: pointer;
}

/* 拖拽时的样式 */
.card-wrapper.dragging {
  opacity: 0.5;
}

.card {
  width: 150px;
  height: 42px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
}

.card-wrapper.folded .card {
  width: 30px;
  height: 42px;
}

.card-content {
  padding: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.card-wrapper.folded .card-content {
  padding: 5px;
  transform: rotate(90deg);
  transform-origin: center;
  width: 200px;
  height: 30px;
}

.card-image {
  width: 60px;
  height: 60px;
  margin-bottom: 10px;
}

.card-wrapper.folded .card-image {
  width: 20px;
  height: 20px;
  margin-bottom: 5px;
}

.card h3 {
  font-size: 14px;
  margin: 5px 0;
}

.card-wrapper.folded .card h3 {
  font-size: 10px;
  white-space: nowrap;
  width: 20px;
}

.card p {
  font-size: 12px;
  margin: 5px 0;
  text-align: center;
}

.card-wrapper.folded .card p {
  font-size: 8px;
  display: none;
}

.card-status {
  margin-top: auto;
  font-size: 10px;
  color: #666;
}

.card-wrapper.folded .card-status {
  display: none;
}

.status-item {
  display: block;
}

/* 卡牌类型样式 */
.eat {
  background-color: #ffecb3;
  border: 2px solid #ffc107;
}

.stop {
  background-color: #ffcdd2;
  border: 2px solid #f44336;
}

.cash {
  background-color: #c8e6c9;
  border: 2px solid #4caf50;
}

/* 可见性样式 */
.hidden {
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(0,0,0,0.1) 10px,
    rgba(0,0,0,0.1) 20px
  );
}

.hidden .card-content {
  opacity: 0.5;
}

.hidden .card-image {
  filter: blur(3px);
}

.hidden h3, .hidden p {
  color: #666;
}

/* 折叠边缘指示器 */
.fold-indicator {
  position: absolute;
  top: 0;
  right: -5px;
  width: 8px;
  height: 100%;
  border-radius: 0 3px 3px 0;
  opacity: 0.9;
  box-shadow: 1px 0 2px rgba(0,0,0,0.2);
}

.fold-indicator.eat {
  background-color: #ffc107;
}

.fold-indicator.stop {
  background-color: #f44336;
}

.fold-indicator.cash {
  background-color: #4caf50;
}

.card-wrapper:not(.folded) .fold-indicator {
  display: none;
}
</style>
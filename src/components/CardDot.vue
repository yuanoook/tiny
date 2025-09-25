<template>
  <div 
    class="card-dot"
    :class="[
      cardClass,
      { 
        'dragging': isDragging, 
        'disguised': card.isDisguised, 
        'hidden': card.visibility === 'hidden',
        'empty': card.isEmpty && !(card.isDisguised && card.disguiseColor),
        'header-card': isHeaderCard,
        'deck-card': isDeckCard,
        'deck-header-card': isDeckHeaderCard
      }
    ]"
    :style="cardStyle"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @dblclick="handleDoubleClick"
  >
    <span class="card-id" v-if="!card.isEmpty || card.cardNo">{{ card.cardNo }}</span>
  </div>
</template>

<script>
export default {
  name: "CardDot",
  props: {
    card: {
      type: Object,
      required: true
    },
    isDragging: {
      type: Boolean,
      default: false
    },
    isHeaderCard: {
      type: Boolean,
      default: false
    },
    isDeckCard: {
      type: Boolean,
      default: false
    },
    isDeckHeaderCard: {
      type: Boolean,
      default: false
    },
    cardStyle: {
      type: Object,
      default: () => ({})
    },
    index: {
      type: Number,
      default: 0
    }
  },
  computed: {
    cardClass() {
      const classes = [];
      
      // 如果是伪装的空卡牌，显示伪装样式
      if (this.card.isEmpty && this.card.isDisguised && this.card.disguiseColor) {
        classes.push(this.card.disguiseColor);
        classes.push('disguised');
      } 
      // 如果是未伪装的空卡牌，显示空卡牌样式
      else if (this.card.isEmpty) {
        classes.push('empty');
      } 
      // 如果是非空卡牌，显示正常颜色或伪装颜色
      else {
        classes.push(this.card.isDisguised ? this.card.disguiseColor : this.card.color);
      }
      
      // 如果是原型卡牌，添加prototype类
      if (this.card.isPrototype) {
        classes.push('prototype');
      }
      
      return classes.join(' ');
    }
  },
  methods: {
    handleDragStart(event) {
      // 将卡牌和事件传递给父组件
      this.$emit('dragstart', event);
    },
    handleDragEnd(event) {
      this.$emit('dragend', event);
    },
    handleDoubleClick() {
      this.$emit('doubleclick', this.card);
    }
  }
}
</script>

<style scoped>
/* 确保.card-dot有相对定位以便.card-id正确定位 */
.card-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin: 2px;
  margin-bottom: -4px;
  cursor: pointer;
  display: inline-block;
  position: relative;
}

/* 头部区域的卡牌样式 */
.card-dot.header-card {
  width: 20px;
  height: 20px;
  margin: 2px;
  display: inline-block;
}

/* 新牌堆和弃牌堆区域的卡牌样式 */
.card-dot.deck-card {
  position: absolute !important;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

/* 新牌堆和弃牌堆区域的标题卡牌样式 */
.card-dot.deck-header-card {
  position: absolute !important;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
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

/* empty卡牌样式 */
.card-dot.empty {
  background-color: transparent;
  border: 2px dashed #9e9e9e;
  position: relative;
}

/* 非隐藏的empty卡牌样式 */
.card-dot.empty:not(.hidden) {
  background-color: transparent;
  border: 2px solid #ffffff;
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

/* 拖拽时完全隐藏原型空卡牌 */
.card-dot.empty.prototype.dragging {
  opacity: 0;
}

/* 隐藏卡牌样式 */
.card-dot.hidden:not(.disguised) {
  background-color: #9e9e9e !important;
  border: 2px solid #616161 !important;
}

/* 隐藏的空卡牌样式 */
.card-dot.empty.hidden:not(.disguised) {
  background-color: #9e9e9e !important;
  border: 2px solid #616161 !important;
}

/* 拖拽时跟随鼠标的卡牌样式 */
.card-dot.dragging-card {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin: 0;
  cursor: pointer;
  display: inline-block;
  opacity: 1 !important;
}

/* 卡牌编号样式 */
.card-id {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  font-weight: bold;
  pointer-events: none;
  z-index: 1;
}
</style>
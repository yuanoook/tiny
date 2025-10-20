<template>
  <div 
    class="card"
    :class="[
      cardClass,
      { 
        'dragging': isDragging, 
        'disguised': card.isDisguised, 
        'hidden': card.visibility === 'hidden',
        'empty': card.type === 'empty' && !(card.isDisguised && card.disguiseColor),
        'header-card': isHeaderCard,
        'deck-card': isDeckCard,
        'deck-header-card': isDeckHeaderCard,
        'self-view': isSelfView
      }
    ]"
    :style="cardStyle"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @dblclick="handleDoubleClick"
  >
    <span class="card-id" v-if="card.type !== 'empty' || card.cardNo">{{ card.cardNo }}</span>
    <!-- 保留小圆点展示卡牌的真正类型 -->
    <div class="true-type-hole" v-if="isSelfView && card.type !== 'empty'">
      <div class="true-type-indicator" :class="card.type"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Card",
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
    isSelfView: {
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
      if (this.card.type === 'empty' && this.card.isDisguised && this.card.disguiseColor) {
        classes.push(this.card.disguiseColor);
        classes.push('disguised');
      } 
      // 如果是未伪装的空卡牌，显示空卡牌样式
      else if (this.card.type === 'empty') {
        classes.push('empty');
      } 
      // 如果是非空卡牌，显示正常颜色或伪装颜色
      else {
        classes.push(this.card.isDisguised ? this.card.disguiseColor : this.card.type);
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
/* 传统卡牌形状 */
.card {
  width: 50px;
  height: 70px;
  border-radius: 8px;
  margin: 5px;
  cursor: pointer;
  display: inline-block;
  position: relative;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border: 2px solid transparent;
}

/* 头部区域的卡牌样式 */
.card.header-card {
  width: 50px;
  height: 70px;
  margin: 5px;
  display: inline-block;
}

/* 新牌堆和弃牌堆区域的卡牌样式 */
.card.deck-card {
  position: absolute !important;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

/* 新牌堆和弃牌堆区域的标题卡牌样式 */
.card.deck-header-card {
  position: absolute !important;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.card.red {
  background-color: #ff6b6b;
  border-color: #d32f2f;
}

.card.yellow {
  background-color: #f9c942;
  border-color: #fbc02d;
}

.card.green {
  background-color: #51cf66;
  border-color: #388e3c;
}

/* empty卡牌样式 */
.card.empty {
  background-color: transparent;
  border: 2px dashed #9e9e9e;
  position: relative;
}

/* 非隐藏的empty卡牌样式 */
.card.empty:not(.hidden) {
  background-color: transparent;
  border: 2px solid #ffffff;
}

/* 伪装卡牌样式 */
.card.disguised {
  position: relative;
}

/* 伪装卡牌的斜纹半透明白色覆盖 */
.card.disguised::after {
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
  border-radius: 8px;
}

/* 拖拽时隐藏原位置的卡牌 */
.card.dragging {
  opacity: 0;
}

/* 拖拽时完全隐藏原型空卡牌 */
.card.empty.prototype.dragging {
  opacity: 0;
}

/* 隐藏卡牌样式 */
.card.hidden:not(.disguised) {
  background-color: #9e9e9e !important;
  border-color: #616161 !important;
}

/* 隐藏的空卡牌样式 */
.card.empty.hidden:not(.disguised) {
  background-color: #9e9e9e !important;
  border-color: #616161 !important;
}

/* 拖拽时跟随鼠标的卡牌样式 */
.card.dragging-card {
  width: 50px;
  height: 70px;
  border-radius: 8px;
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
  font-size: 14px;
  font-weight: bold;
  pointer-events: none;
  z-index: 1;
}

/* 玩家自己查看时的样式 */
.card.self-view {
  position: relative;
}

/* 小孔样式 - 保留在卡牌中下方 */
.true-type-hole {
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: white;
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
}

/* 真正类型的指示器 */
.true-type-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.true-type-indicator.red {
  background-color: #ff6b6b;
}

.true-type-indicator.yellow {
  background-color: #f9c942;
}

.true-type-indicator.green {
  background-color: #51cf66;
}
</style>
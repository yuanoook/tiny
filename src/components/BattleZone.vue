<template>
  <div class="battle-zone" @dragover.prevent="handleDragOver" @drop="handleDrop">
    <div class="zone-header">
      <h3>PK对战区</h3>
      <div class="battle-status" v-if="battleStarted">
        <span>战斗进行中...</span>
      </div>
    </div>
    <div class="zone-content">
      <!-- 显示在对战区的卡牌 -->
      <CardDot
        v-for="card in battleCards"
        :key="card.id"
        :card="card"
        :is-dragging="isDragging(card)"
        @dragstart="handleDragStart(card, $event)"
        @dragend="handleDragEnd"
      />
    </div>
    <div class="battle-instructions" v-if="!battleStarted">
      <p>将黄色卡牌或伪装成黄色的卡牌拖拽到这里开始战斗</p>
      <p>第一张牌必须是黄色类型或伪装为黄色类型</p>
    </div>
  </div>
</template>

<script>
import CardDot from './CardDot.vue';
import { isYellowCard } from '../utils/cardUtils.js';

export default {
  name: "BattleZone",
  components: {
    CardDot
  },
  props: {
    cards: {
      type: Array,
      required: true
    },
    isDragging: {
      type: Function,
      required: true
    },
    handleDragStart: {
      type: Function,
      required: true
    },
    handleDragEnd: {
      type: Function,
      required: true
    },
    handleDragOver: {
      type: Function,
      required: true
    },
    handleBattleDrop: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      battleStarted: false
    };
  },
  computed: {
    battleCards() {
      // 获取在PK对战区的卡牌
      return this.cards.filter(card => card.owner === 'battle');
    }
  },
  methods: {
    handleDrop(event) {
      this.handleBattleDrop('battle', null, this.cards, this.battleStarted, (newBattleState) => {
        this.battleStarted = newBattleState;
      }, event);
    }
  }
};
</script>

<style scoped>
.battle-zone {
  border: 2px dashed #ff9800;
  border-radius: 10px;
  padding: 15px;
  margin: 20px 0;
  min-height: 120px;
  background-color: #fff3e0;
  position: relative;
}

.zone-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.zone-header h3 {
  margin: 0;
  color: #e65100;
}

.battle-status {
  background-color: #ff9800;
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
}

.zone-content {
  min-height: 80px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.battle-instructions {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #9e9e9e;
  font-size: 14px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.battle-instructions p {
  margin: 5px 0;
}
</style>
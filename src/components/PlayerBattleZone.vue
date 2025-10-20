<template>
  <div class="player-battle-zone" @dragover.prevent="handleDragOver" @drop="handleDrop">
    <div class="zone-header">
      <h4>对战区</h4>
      <div class="battle-status" v-if="battleStarted">
        <span>战斗进行中...</span>
      </div>
    </div>
    <div class="zone-content">
      <!-- 显示在对战区的卡牌 -->
      <Card
        v-for="card in battleCards"
        :key="card.id"
        :type="card.type"
        :is-disguised="card.isDisguised"
        :disguise-color="card.disguiseColor"
        :card-no="card.cardNo"
        :is-draggable="false"
        :is-self-view="isSelfView"
        @dblclick="() => handleDoubleClick(card)"
      />
    </div>
    <div class="battle-instructions" v-if="!battleStarted">
      <p>将黄色卡牌拖拽到这里开始战斗</p>
    </div>
  </div>
</template>

<script>
import Card from './Card.vue';
import { isYellowCard } from '../utils/cardUtils.js';

export default {
  name: "PlayerBattleZone",
  components: {
    Card
  },
  props: {
    cards: {
      type: Array,
      required: true
    },
    playerId: {
      type: String,
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
    },
    isSelfView: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      battleStarted: false
    };
  },
  computed: {
    battleCards() {
      // 获取属于当前玩家的对战区卡牌
      return this.cards.filter(card => card.owner === `battle-${this.playerId}`);
    }
  },
  methods: {
    handleDrop(event) {
      this.handleBattleDrop(`battle-${this.playerId}`, null, this.cards, this.battleStarted, (newBattleState) => {
        this.battleStarted = newBattleState;
      }, event);
    },
    handleDoubleClick(card) {
      // 双击卡牌的处理逻辑可以根据需要添加
      console.log('双击卡牌:', card);
      // 这里可以添加更多逻辑，比如查看卡牌详情等
      this.$emit('card-double-click', card);
    }
  }
};
</script>

<style scoped>
.player-battle-zone {
  border: 2px dashed #ff9800;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 15px;
  min-height: 80px;
  background-color: #fff3e0;
  position: relative;
}

.zone-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.zone-header h4 {
  margin: 0;
  color: #e65100;
  font-size: 14px;
}

.battle-status {
  background-color: #ff9800;
  color: white;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 11px;
}

.zone-content {
  min-height: 50px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.battle-instructions {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #9e9e9e;
  font-size: 12px;
  width: 100%;
  padding: 0 15px;
  box-sizing: border-box;
}

.battle-instructions p {
  margin: 3px 0;
}
</style>
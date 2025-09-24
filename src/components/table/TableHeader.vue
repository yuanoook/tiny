<template>
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
</template>

<script>
import CardDot from '../CardDot.vue';
import { getCardsInColumnHeader } from '../../gameState.js';

export default {
  name: "TableHeader",
  components: {
    CardDot
  },
  props: {
    baseZones: {
      type: Array,
      required: true
    },
    players: {
      type: Array,
      required: true
    },
    cards: {
      type: Object,
      required: true
    },
    nextGlobalId: {
      type: Number,
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
    handleDropToHeader: {
      type: Function,
      required: true
    },
    toggleCardDisguise: {
      type: Function,
      required: true
    }
  },
  methods: {
    getCardsInColumnHeader(zoneId) {
      return getCardsInColumnHeader(this.cards, zoneId);
    }
  }
}
</script>

<style scoped>
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
</style>
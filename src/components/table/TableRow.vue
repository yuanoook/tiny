<template>
  <div class="table-row" v-for="zone in zones" :key="`row-${zone.id}`">
    <div 
      class="row-header" 
      @dragover.prevent="handleDragOver"
      @drop="handleDropToHeader(zone.id, cards, nextGlobalId)"
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
    <!-- 各区域的单元格 -->
    <div 
      class="table-cell" 
      v-for="colZone in allZones" 
      :key="`${zone.id}-${colZone.id}`"
      :class="[`cell-${zone.id}-${colZone.id}`, { 'center-zone': isCenterZone(zone.id, colZone.id), 'deck-cell': zone.id === 'deck', 'discard-cell': zone.id === 'discard' }]"
      @dragover.prevent="handleDragOver"
      @drop="handleDrop(zone.id, colZone.id, cards, nextGlobalId)"
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
</template>

<script>
import CardDot from '../CardDot.vue';
import { getCardsInRowHeader, getCardsInCell, isCenterZone } from '../../gameState.js';

export default {
  name: "TableRow",
  components: {
    CardDot
  },
  props: {
    zones: {
      type: Array,
      required: true
    },
    allZones: {
      type: Array,
      required: true
    },
    cards: {
      type: Object,
      required: true
    },
    nextGlobalId: {
      type: Object,
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
    handleDrop: {
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
    getCardsInRowHeader(zoneId) {
      return getCardsInRowHeader(this.cards, zoneId);
    },
    getCardsInCell(rowZoneId, colZoneId) {
      return getCardsInCell(this.cards, rowZoneId, colZoneId);
    },
    isCenterZone(rowZoneId, colZoneId) {
      return isCenterZone(rowZoneId, colZoneId);
    }
  }
}
</script>

<style scoped>
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

.deck-cell, .discard-cell {
  /* 特殊样式可以在这里添加 */
}
</style>
<template>
  <div class="game-table">
    <!-- 表头 -->
    <TableHeader
      :base-zones="baseZones"
      :players="players"
      :cards="cards"
      :is-dragging="isDragging"
      :handle-drag-start="handleDragStart"
      :handle-drag-end="handleDragEnd"
      :handle-drag-over="handleDragOver"
      :handle-drop-to-header="handleDropToHeader"
      :toggle-card-disguise="toggleCardDisguise"
    />
    
    <!-- 行 -->
    <TableRow
      :zones="allZones"
      :all-zones="allZones"
      :cards="cards"
      :is-dragging="isDragging"
      :handle-drag-start="handleDragStart"
      :handle-drag-end="handleDragEnd"
      :handle-drag-over="handleDragOver"
      :handle-drop="handleDrop"
      :handle-drop-to-header="handleDropToHeader"
      :toggle-card-disguise="toggleCardDisguise"
    />
  </div>
</template>

<script>
import TableHeader from './table/TableHeader.vue';
import TableRow from './table/TableRow.vue';

export default {
  name: "GameTable",
  components: {
    TableHeader,
    TableRow
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
      type: Array,
      required: true
    },
    allZones: {
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
  }
}
</script>

<style scoped>
.game-table {
  display: inline-block;
  border: 2px solid white;
  border-radius: 10px;
  overflow: hidden;
  margin: 20px 0;
}
</style>
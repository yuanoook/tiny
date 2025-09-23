<template>
  <div class="modal-overlay" v-if="showCardModal" @click="closeModal">
    <div class="card-modal" @click.stop>
      <div class="modal-options-circles">
        <div class="option-circle" 
             :class="currentCard && currentCard.visibility === 'hidden' ? currentCard.color : 'hidden'"
             @click="toggleCardVisibility">
          {{ currentCard ? currentCard.id : '' }}
        </div>
        <div class="option-circle red" 
             :class="{ 'active': currentCard && currentCard.isDisguised && currentCard.disguiseColor === 'red' }"
             @click="setDisguiseColor('red')"></div>
        <div class="option-circle yellow" 
             :class="{ 'active': currentCard && currentCard.isDisguised && currentCard.disguiseColor === 'yellow' }"
             @click="setDisguiseColor('yellow')"></div>
        <div class="option-circle green" 
             :class="{ 'active': currentCard && currentCard.isDisguised && currentCard.disguiseColor === 'green' }"
             @click="setDisguiseColor('green')"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CardModal",
  props: {
    showCardModal: {
      type: Boolean,
      default: false
    },
    currentCard: {
      type: Object,
      default: null
    }
  },
  emits: ['update:showCardModal', 'toggleCardVisibility', 'setDisguiseColor'],
  methods: {
    closeModal() {
      this.$emit('update:showCardModal', false);
    },
    toggleCardVisibility() {
      this.$emit('toggleCardVisibility');
    },
    setDisguiseColor(color) {
      this.$emit('setDisguiseColor', color);
    }
  }
}
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

.card-modal {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-options-circles {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.option-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-weight: bold;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
}

.option-circle:hover {
  transform: scale(1.1);
}

.option-circle.red {
  background-color: #ff6b6b;
}

.option-circle.yellow {
  background-color: #ffd166;
}

.option-circle.green {
  background-color: #06d6a0;
}

.option-circle.hidden {
  background-color: #6c757d;
}

.option-circle.active {
  border: 3px solid #333;
  box-shadow: 0 0 0 3px white, 0 0 0 6px #333;
}
</style>
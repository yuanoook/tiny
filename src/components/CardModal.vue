<template>
  <div class="modal-overlay" v-if="showCardModal" @click="closeModal">
    <div class="card-modal" @click.stop>
      <div class="modal-options-circles">
        <div class="option-circle hidden" 
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
  margin: 20px 0;
  padding: 10px 0;
}

.modal-options-circles .option-circle {
  width: 40px;
  height: 40px;
  margin: 0;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
}

.modal-options-circles .option-circle:first-child {
  margin-right: 30px;
}

.modal-options-circles .option-circle:first-child::after {
  display: none;
}

.modal-options-circles .option-circle:not(:first-child) {
  margin: 0 5px;
}

.option-circle {
  width: 40px;
  height: 40px;
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
  border: 2px solid #d32f2f;
  position: relative;
}

.option-circle.red::after {
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

.option-circle.yellow {
  background-color: #f9c942;
  border: 2px solid #fbc02d;
  position: relative;
}

.option-circle.yellow::after {
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

.option-circle.green {
  background-color: #51cf66;
  border: 2px solid #388e3c;
  position: relative;
}

.option-circle.green::after {
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

.option-circle.hidden {
  background-color: #9e9e9e;
  border: 2px solid #616161;
}

/* 激活状态的伪装选项样式 */
.option-circle.active {
  transform: scale(1.1);
  transition: all 0.2s ease;
}

.option-circle.red.active {
  box-shadow: 0 0 10px 5px rgba(255, 107, 107, 0.5);
}

.option-circle.yellow.active {
  box-shadow: 0 0 10px 5px rgba(249, 201, 66, 0.5);
}

.option-circle.green.active {
  box-shadow: 0 0 10px 5px rgba(81, 207, 102, 0.5);
}
</style>
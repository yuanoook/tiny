<template>
  <div class="card" :class="cardType">
    <div class="card-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Card",
  props: {
    cardType: {
      type: String,
      default: ""
    }
  }
};
</script>

<style scoped>
.card {
  width: 200px;
  height: 300px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.card-content {
  /* padding: 20px; */
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

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
</style>

<style>
.card .card-image {
  width: 100%;
  margin-bottom: 15px;
}
</style>

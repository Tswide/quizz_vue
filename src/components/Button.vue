<template>
  <button class="valide-button" @click="$emit('validate')">
    {{ buttonValue }}
  </button>
</template>

<script>
export default {
  props: {
    buttonValue: {
      type: String, 
      required: true 
    }
  }
};
</script>

<style scoped>
.valide-button {
  border: 4px solid #7ED957;
  border-radius: 100px;
  background-color: #F4F1F6;
  color: #7ED957;
  padding: 8px 40px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
}

.valide-button:hover {
  background-color: #7ED957;
  color: #F4F1F6;
}
</style>

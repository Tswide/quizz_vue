<template>
  <div class="container">
    <input
      type="text"
      placeholder="Votre réponse"
      v-model="inputValue"
      :disabled="disabled"
    >
  </div>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inputValue: ''
    };
  },
  watch: {
    inputValue(newVal) {
      this.$emit('input-value-changed', newVal);
    }
  },
  methods: {
    resetInput() {
      this.inputValue = '';
    }
  }
};
</script>

<style scoped>
.container {
  width: 400px;
  height: 50px;
  border-radius: 100px;
  background-image: linear-gradient(to right, #ff66c4, #ffde59);
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

input {
  width: 100%;
  height: 100%;
  border: none;
  background-color: #f4f1f6;
  padding: 10px;
  font-size: 16px;
  color: #241a39;
  border-radius: 100px;
  text-align: center;
}

input::placeholder {
  color: #dfd4e6;
}
</style>

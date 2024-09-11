<script setup>
import { RouterView } from 'vue-router'
import router from './router'
import axios from 'axios';

function handleServerError(error) {
  if (error.response.status === 500) {
    router.push({ name: 'error500' })
  }
}

axios.interceptors.response.use(response => {
  return response;
}, error => {
  handleServerError(error);
  return Promise.reject(error);
});

</script>

<template>
  <RouterView />
</template>

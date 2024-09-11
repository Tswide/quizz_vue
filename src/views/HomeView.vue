<template>
  <div class="h-screen flex flex-col justify-center items-center">
    <h1 class="text-2xl mb-8">{{ title }}</h1>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div v-for="category in categories" :key="category.id" class="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400">
        <div class="min-w-0 flex-1">
          <a href="#" class="focus:outline-none" @click="navigate(category.id)">
            <span class="absolute inset-0" aria-hidden="true" />
            <p class="text-sm font-medium text-gray-900">{{ category.title }}</p>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const categories = ref([]);
let title = ref('Choisis le jeu auquel tu veux jouer')

const fetchCategories = async () => {
  try {
    const response = await axios.get('https://quizz-musical-backend.airdev.be/api/categories');
    const activeCategories = response.data.filter(category => category.is_active === 1);
    categories.value = activeCategories;
    console.log(response.data)
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories', error);
    title.value = 'excuse pour le probleme, va etre resolue sous peu'
  }
};

const navigate = (categoryId) => {
  localStorage.removeItem('answers');
  localStorage.removeItem('points');

  router.push({ name: 'quizz', params: { id_category: categoryId } });
};

onMounted(() => {
  fetchCategories();
});
</script>

<style>
body {
  background-color: #241A39;
  color: white;
}
.category{
  display:flex;
  flex-wrap: wrap;
  width:70%;
  margin-left:auto;
  margin-right:auto;
}
.category-content {
  background-color: black;
  width: 438px;
  height: 233px;
  cursor: pointer;
  margin-top: 100px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
}
.category-content:hover {
  transition: transform 1s;
  transform: scale(1.1);
  background-color: white;
}
</style>
<template>
  <section class="container m-auto my-10">
    <button @click="navigate(id_category)" class="mr-5 rounded-md bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
      Rejouer
    </button>
    <button @click="navigateToHome()" class="rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
      Nouvelle Categorie
    </button>
  </section>
  <section class="container m-auto">
    <ul role="list" class="divide-y divide-gray-800">
      <li v-for="(answer, index) in answers" :key="index" class="flex justify-between gap-x-6 py-5">
        <div class="flex min-w-0 gap-x-4">
          <div class="min-w-0 flex-auto">
            <p class="text-m font-semibold leading-6">{{ answer.author }}</p>
            <p class="mt-1 truncate text-sm leading-5 text-gray-400">{{ answer.title }}</p>
          </div>
        </div>
        <div class="shrink-0 sm:flex sm:flex-col sm:items-end">
          <p class="leading-6 text-m">
            <span
              class="text-xl font-semibold"
              :class="{ 'text-green-500': points[index].result > 0, 'text-red-500': points[index].result === 0 }"
            >
                {{ answer.input }}
            </span> / {{ answer.answer }}
          </p>
          <p class="mt-1 text-sm leading-5 text-gray-400">
            {{ points[index].result }} / {{ points[index].max }} Points
          </p>
        </div>
      </li>
    </ul>
  </section>
  <section class="container m-auto mt-10 flex justify-between">
    <p class="text-2xl font-bold">Total des points:</p>
    <p class="text-2xl font-bold">{{ calculateTotalPoints() }} / {{ calculateMaxPoints() }} Points</p>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { getCategoryId, getAnswers, getPoints } from '@/core/localStorage';

const router = useRouter();

const id_category = getCategoryId();
const answers = getAnswers() || [];
const points = getPoints() || [];

const navigate = (categoryId) => {
  router.push({ name: 'quizz', params: { id_category: categoryId } });
};

const navigateToHome = () => {
  router.push({ name: 'home' });
};

const calculateTotalPoints = () => {
  let totalPoints = 0;
  points.forEach(point => {
    totalPoints += point.result;
  });
  return totalPoints;
};

const calculateMaxPoints = () => {
  let maxPoints = 0;
  points.forEach(point => {
    maxPoints += point.max;
  });
  return maxPoints;
};
</script>

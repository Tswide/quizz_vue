import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Quizz from '@/views/QuizzView.vue'
import ResultView from '@/views/ResultView.vue'
import NotFound from '@/views/NotFound.vue'
import Error500 from '@/views/Error500.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/quizz/:id_category',
      name: 'quizz',
      component: Quizz,
      props: true
    },
    {
      path: '/result',
      name: 'result',
      component: ResultView,
    },
    {
      path: '/error500',
      name: 'error500',
      component: Error500,
    },
    { path: '/:pathMatch(.*)*', component: NotFound },
  ]
})

export default router

import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue'; // 更新引用
import KnockoutDraw from '../views/KnockoutDraw.vue';
import NvsNDraw from '../views/NvsNDraw.vue';


const routes = [
  {
    path: '/TournamentDraw',
    name: 'HomePage',
    component: HomePage // 更新为 HomePage
  },
  {
    path: '/TournamentDraw/knockout',
    name: 'KnockoutDraw',
    component: KnockoutDraw
  },
  {
    path: '/TournamentDraw/nvsn',
    name: 'NvsNDraw',
    component: NvsNDraw
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

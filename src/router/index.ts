import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import KnockoutDraw from '../views/KnockoutDraw.vue';
import NvsNDraw from '../views/NvsNDraw.vue';
import LaunchDraw from '../views/LaunchDraw.vue';

const routes = [
  {
    path: '/TournamentDraw',
    name: 'HomePage',
    component: HomePage
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
  },
  {
    path: '/TournamentDraw/launch',
    name: 'LaunchDraw',
    component: LaunchDraw
  }
];

const router = createRouter({
  // history: createWebHashHistory(), // 添加项目路径
  history: createWebHistory(), // 添加项目路径
  routes
});

export default router;

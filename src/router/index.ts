import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import KnockoutDraw from '../views/KnockoutDraw.vue';
import teamDraw from '../views/TeamDraw.vue';
import LaunchDraw from '../views/LaunchDraw.vue';

const routes = [
  {
    path: '/roll-it',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/roll-it/knockout',
    name: 'KnockoutDraw',
    component: KnockoutDraw
  },
  {
    path: '/roll-it/nvsn',
    name: 'teamDraw',
    component: teamDraw
  },
  {
    path: '/roll-it/launch',
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

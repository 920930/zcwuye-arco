import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/dashboard',
  name: 'dashboard',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.server.dashboard',
    requiresAuth: true,
  },
  children: [
    {
      path: 'workplace',
      name: 'Workplace',
      component: () => import('@/views/dashboard/workplace/index.vue'),
      meta: {
        locale: 'menu.server.workplace',
        requiresAuth: true,
      },
    },
    {
      path: 'user',
      name: 'user',
      component: () => import('@/views/dashboard/user/index.vue'),
      meta: {
        locale: 'menu.server.user',
        requiresAuth: true,
      },
    },
    {
      path: 'room',
      name: 'room',
      component: () => import('@/views/dashboard/room/index.vue'),
      meta: {
        locale: 'menu.server.room',
        requiresAuth: true,
      },
    },
  ],
};

export default DASHBOARD;

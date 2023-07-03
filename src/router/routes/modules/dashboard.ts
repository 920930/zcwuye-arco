import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/dashboard',
  name: 'dashboard',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.server.dashboard',
    requiresAuth: true,
    icon: 'icon-dashboard',
    order: 0,
  },
  children: [
    {
      path: 'workplace',
      name: 'Workplace',
      component: () => import('@/views/dashboard/workplace/index.vue'),
      meta: {
        locale: 'menu.server.workplace',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'menu',
      name: 'menu',
      component: () => import('@/views/menu/index.vue'),
      meta: {
        locale: '菜单列表',
        requiresAuth: true,
      },
    },
  ],
};

export default DASHBOARD;

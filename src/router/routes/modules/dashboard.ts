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
      path: 'room',
      name: 'room',
      component: () => import('@/views/dashboard/room/index.vue'),
      meta: {
        locale: 'menu.server.room',
        requiresAuth: true,
      },
    },
    {
      path: 'room/:id/contract/:cid',
      name: 'roomShow',
      component: () => import('@/views/dashboard/room/show.vue'),
      meta: {
        locale: 'menu.server.roomShow',
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
      path: 'contract',
      name: 'contract',
      component: () => import('@/views/dashboard/contract/index.vue'),
      meta: {
        locale: 'menu.server.contract',
        requiresAuth: true,
      },
    },
    {
      path: 'contract/:id/edit',
      name: 'contractStore',
      component: () => import('@/views/dashboard/contract/store.vue'),
      meta: {
        locale: 'menu.server.contractStore',
        requiresAuth: true,
      },
    },
    {
      path: 'contract/:id',
      name: 'contractShow',
      component: () => import('@/views/dashboard/contract/show.vue'),
      meta: {
        locale: 'menu.server.contractShow',
        requiresAuth: true,
      },
    },
  ],
};

export default DASHBOARD;

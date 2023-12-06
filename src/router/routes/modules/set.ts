import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/set',
  name: 'set',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.server.set',
    requiresAuth: true,
    icon: 'icon-dashboard',
    order: 0,
  },
  children: [
    {
      path: 'menu',
      name: 'menu',
      component: () => import('@/views/set/menu.vue'),
      meta: {
        locale: '菜单列表',
        requiresAuth: true,
      },
    },
    {
      path: 'company',
      name: 'company',
      component: () => import('@/views/set/company.vue'),
      meta: {
        locale: '公司列表',
        requiresAuth: true,
      },
    },
    {
      path: 'adminer',
      name: 'adminer',
      component: () => import('@/views/set/adminer.vue'),
      meta: {
        locale: '员工列表',
        requiresAuth: true,
      },
    },
    {
      path: 'role',
      name: 'role',
      component: () => import('@/views/set/role.vue'),
      meta: {
        locale: '角色列表',
        requiresAuth: true,
      },
    },
    {
      path: 'permission',
      name: 'permission',
      component: () => import('@/views/set/permission.vue'),
      meta: {
        locale: '权限列表',
        requiresAuth: true,
      },
    },
    {
      path: 'costype',
      name: 'costype',
      component: () => import('@/views/set/costype.vue'),
      meta: {
        locale: '费用类型',
        requiresAuth: true,
      },
    },
  ],
};

export default DASHBOARD;

import Mock from 'mockjs';
import setupMock, { successResponseWrap, failResponseWrap } from '@/utils/setup-mock';

import { MockParams } from '@/types/mock';
import { isLogin } from '@/utils/auth';

const menus = [
  [
    {
      path: '/dashboard',
      name: 'dashboard',
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
          meta: {
            locale: 'menu.server.workplace',
            requiresAuth: true,
          },
        },
        {
          path: 'user',
          name: 'User',
          meta: {
            locale: '商户列表',
            requiresAuth: true,
          },
        },
        {
          path: 'company',
          name: 'set.company',
          meta: {
            locale: '公司详情',
            requiresAuth: true,
            roles: ['admin'],
          },
        },
      ],
    },
    {
      path: '/room',
      name: 'Room',
      meta: {
        locale: '资产管理',
        requiresAuth: true,
        roles: ['admin'],
      },
      children: [
        {
          path: 'list',
          name: 'Room.list',
          meta: {
            locale: '商铺列表',
            requiresAuth: true,
            roles: ['admin'],
          },
        },
        {
          path: 'ad',
          name: 'adlist',
          meta: {
            locale: '广告位列表',
            requiresAuth: true,
            roles: ['admin'],
          },
        },
      ],
    },
    {
      path: '/caiwu',
      name: 'Caiwu',
      meta: {
        locale: '财务管理',
        requiresAuth: true,
        roles: ['admin'],
      },
      children: [
        {
          path: 'list',
          name: 'Caiwu.list',
          meta: {
            locale: '合同列表',
            requiresAuth: true,
            roles: ['admin'],
          },
        },
      ],
    },
  ],
  [
    {
      path: '/dashboard',
      name: 'dashboard',
      meta: {
        locale: 'menu.server.dashboard',
        requiresAuth: true,
        icon: 'icon-dashboard',
        order: 1,
      },
      children: [
        {
          path: 'workplace',
          name: 'Workplace',
          meta: {
            locale: 'menu.server.workplace',
            requiresAuth: true,
          },
        },
        {
          path: 'company',
          name: 'Company',
          meta: {
            locale: 'menu.company',
            requiresAuth: true,
          },
        },
      ],
    },
  ],
  [
    {
      path: '/dashboard',
      name: 'dashboard',
      meta: {
        locale: 'menu.server.dashboard',
        requiresAuth: true,
        icon: 'icon-dashboard',
        order: 1,
      },
      children: [
        {
          path: 'workplace',
          name: 'Workplace',
          meta: {
            locale: 'menu.server.workplace',
            requiresAuth: true,
          },
        },
        {
          path: 'company',
          name: 'Company',
          meta: {
            locale: 'menu.company',
            requiresAuth: true,
          },
        },
      ],
    },
  ],
];
setupMock({
  setup() {
    // Mock.XHR.prototype.withCredentials = true;

    // 用户信息
    Mock.mock(new RegExp('/api/user/info'), () => {
      if (isLogin()) {
        return successResponseWrap({
          name: '王立群',
          avatar: '//lf1-xgcdn-tos.pstatp.com/obj/vcloud/vadmin/start.8e0e4855ee346a46ccff8ff3e24db27b.png',
          job: '前端艺术家',
          company: [
            { id: 0, name: '总部' },
            { id: 1, name: '华阳' },
            { id: 2, name: '大丰' },
          ],
          introduction: '人潇洒，性温存',
          phone: '150****0000',
          role: 'admin',
        });
      }
      return failResponseWrap(null, '未登录', 50008);
    });

    // 登录
    Mock.mock(new RegExp('/api/user/login'), (params: MockParams) => {
      const { phone, password } = JSON.parse(params.body);
      if (!phone) {
        return failResponseWrap(null, '手机号不能为空', 50000);
      }
      if (!password) {
        return failResponseWrap(null, '密码不能为空', 50000);
      }
      if (phone === '18081990075' && password === '123456') {
        // globalThis.localStorage.setItem('userRole', 'admin');
        return successResponseWrap({
          token: '12345',
        });
      }
      if (phone === '18081990076' && password === '123456') {
        // window.localStorage.setItem('userRole', 'user');
        return successResponseWrap({
          token: '54321',
        });
      }
      return failResponseWrap(null, '账号或者密码错误', 50000);
    });

    // 登出
    Mock.mock(new RegExp('/api/user/logout'), () => {
      return successResponseWrap(null);
    });

    // 用户的服务端菜单
    Mock.mock(new RegExp('/api/user/menu'), ({ url }) => {
      const companyId = new URL(url).search.slice(1).split('=')[1];
      const num = Number.parseInt(companyId, 10);
      const menuList = menus[num];
      return successResponseWrap(menuList);
    });
  },
});

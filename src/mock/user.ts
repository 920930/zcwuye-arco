import Mock from 'mockjs';
import setupMock, { successResponseWrap, failResponseWrap } from '@/utils/setup-mock';

import { MockParams } from '@/types/mock';
import { isLogin } from '@/utils/auth';

setupMock({
  setup() {
    // Mock.XHR.prototype.withCredentials = true;

    // 用户信息
    Mock.mock(new RegExp('/api/user/info'), () => {
      if (isLogin()) {
        const role = window.localStorage.getItem('userRole') || 'admin';
        return successResponseWrap({
          name: '王立群',
          avatar: '//lf1-xgcdn-tos.pstatp.com/obj/vcloud/vadmin/start.8e0e4855ee346a46ccff8ff3e24db27b.png',
          email: 'wangliqun@email.com',
          job: 'frontend',
          jobName: '前端艺术家',
          organization: 'Frontend',
          organizationName: '前端',
          location: 'beijing',
          locationName: '北京',
          introduction: '人潇洒，性温存',
          personalWebsite: 'https://www.arco.design',
          phone: '150****0000',
          registrationDate: '2013-05-10 12:10:00',
          accountId: '15012312300',
          certification: 1,
          role,
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
        globalThis.localStorage.setItem('userRole', 'admin');
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
    Mock.mock(new RegExp('/api/user/menu'), () => {
      const menuList = [
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
        {
          path: '/company1',
          name: 'company1',
          meta: {
            locale: 'menu.dashboard',
            requiresAuth: true,
            icon: 'icon-dashboard',
            order: 1,
          },
          children: [
            {
              path: 'workplace1',
              name: 'workplace1',
              meta: {
                locale: 'menu.server.workplace',
                requiresAuth: true,
              },
            },
          ],
        },
        {
          path: '/company2',
          name: 'company2',
          meta: {
            locale: 'menu.dashboard',
            requiresAuth: true,
            icon: 'icon-dashboard',
            order: 1,
          },
          children: [
            {
              path: 'workplace2',
              name: 'workplace2',
              meta: {
                locale: 'menu.server.workplace',
                requiresAuth: true,
              },
            },
          ],
        },
      ];
      return successResponseWrap(menuList);
    });
  },
});

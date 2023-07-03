import localeMessageBox from '@/components/message-box/locale/zh-CN';
import localeLogin from '@/views/login/locale/zh-CN';

import localeWorkplace from '@/views/dashboard/workplace/locale/zh-CN';

import localeSettings from './zh-CN/settings';

export default {
  'menu.dashboard': '仪表盘',
  'menu.server.dashboard': '仪表盘',
  'menu.server.workplace': '工作台',
  'menu.server.userlist': '商户列表',
  'menu.server.company': '公司列表',
  'menu.server.menu': '菜单列表',
  'menu.server.zhican': '资产管理',
  'menu.server.room': '商铺列表',
  'menu.server.ad': '广告位列表',
  'menu.server.caiwu': '财务管理',
  'menu.server.hetong': '合同列表',
  'menu.server.monitor': '实时监控-服务端',
  'menu.company': '公司列表',
  'menu.list': '列表页',
  'menu.result': '结果页',
  'menu.exception': '异常页',
  'menu.form': '表单页',
  'menu.profile': '详情页',
  'menu.visualization': '数据可视化',
  'menu.user': '个人中心',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': '常见问题',
  'navbar.docs': '文档中心',
  'navbar.action.locale': '切换为中文',
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeWorkplace,
};

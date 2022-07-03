// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    // title: 'home',
    title: '主页',
    path: '/dashboard/home',
    icon: getIcon('eva:home-fill'),
  },
  // {
  //   title: 'dashboard',
  //   path: '/dashboard/app',
  //   icon: getIcon('eva:pie-chart-2-fill'),
  // },
  {
    // title: 'user',
    title: '朋友',
    path: '/dashboard/friend',
    icon: getIcon('eva:people-fill'),
  },
  // {
  //   title: 'user',
  //   path: '/dashboard/user',
  //   icon: getIcon('eva:people-fill'),
  // },
  // {
  //   title: 'product',
  //   path: '/dashboard/products',
  //   icon: getIcon('eva:shopping-bag-fill'),
  // },
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: getIcon('eva:file-text-fill'),
  // },
  {
    // title: 'post',
    title: '帖子',
    path: '/dashboard/post',
    icon: getIcon('eva:file-text-fill'),
  },
  {
    // title: 'account',
    title: '账户',
    path: '/dashboard/account',
    icon: getIcon('bxs:user-account'),
  },
  // {
  //   title: 'setting',
  //   path: '/dashboard/setting',
  //   icon: getIcon('ant-design:setting-filled'),
  // },
  {
    // title: 'profile',
    title: '简介',
    path: '/dashboard/profile',
    icon: getIcon('icomoon-free:profile'),
  },

  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: getIcon('eva:lock-fill'),
  // },
  // {
  //   title: 'register',
  //   path: '/register',
  //   icon: getIcon('eva:person-add-fill'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: getIcon('eva:alert-triangle-fill'),
  // },
];

export default navConfig;

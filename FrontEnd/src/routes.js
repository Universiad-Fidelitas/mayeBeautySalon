import { DEFAULT_PATHS } from 'config.js';

import HorizontalPage from 'views/Horizontal';
import Dashboard from 'views/admin/Dashboard';
import Productos from 'views/admin/Inventario/Productos';
import Roles from 'views/admin/Usuarios/Roles';
import Usuarios from 'views/admin/Usuarios/Usuarios';

const appRoot = DEFAULT_PATHS.APP.endsWith('/') ? DEFAULT_PATHS.APP.slice(1, DEFAULT_PATHS.APP.length) : DEFAULT_PATHS.APP;

const routesAndMenuItems = {
  mainMenuItems: [
    {
      path: DEFAULT_PATHS.APP,
      exact: true,
      redirect: true,
      to: `${appRoot}/dashboard`,
    },
    {
      path: `${appRoot}/dashboard`,
      label: 'menu.dashboard',
      icon: 'dashboard-1',
      component: Dashboard,
      protected: true
    },
    {
      path: `${appRoot}/trabajadores`,
      label: 'menu.trabajadores',
      icon: 'tea',
      protected: true,
      subs: [
        { path: '/usuarios',icon: 'user', label: 'menu.users', component: Usuarios },
        { path: '/roles',icon: 'diagram-1', label: 'menu.roles', component: Roles },
      ],
    },
    {
      path: `${appRoot}/inventario`,
      label: 'Inventario',
      icon: 'activity',
      protected: true,
      subs: [
        { path: '/productos',icon: 'anchor', label: 'Productos', component: Productos },
      ],
    },
  ],
  sidebarItems: [],
};
export default routesAndMenuItems;

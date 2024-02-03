import { DEFAULT_PATHS } from 'config.js';
import Citas from 'views/admin/Citas/Citas';
import Dashboard from 'views/admin/Dashboard';
import Facturas from 'views/admin/Facturas/Facturas';
import Transacciones from 'views/admin/Facturas/Transacciones';
import Categorias from 'views/admin/Inventario/Categorias';
import Inventario from 'views/admin/Inventario/Inventario';
import Productos from 'views/admin/Inventario/Productos';
import Proveedores from 'views/admin/Inventario/Proveedores';
import Servicios from 'views/admin/Inventario/Servicios';
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
      protected: true,
    },
    {
      path: `${appRoot}/citas`,
      label: 'Citas',
      icon: 'check-square',
      component: Citas,
      protected: true,
    },
    {
      path: `${appRoot}/trabajadores`,
      label: 'menu.trabajadores',
      icon: 'laptop',
      subs: [
        { path: '/users', icon: 'user', label: 'menu.users', component: Usuarios },
        { path: '/roles', icon: 'diagram-1', label: 'menu.roles', component: Roles },
      ],
    },
    {
      path: `${appRoot}/inventariado`,
      label: 'Inventariado',
      icon: 'database',
      protected: true,
      subs: [
        { path: '/inventario', icon: 'file-text', label: 'Inventario', component: Inventario },
        { path: '/categorias', icon: 'dropdown', label: 'Categorias', component: Categorias },
        { path: '/productos', icon: 'gift', label: 'Productos', component: Productos },
        { path: '/proveedores', icon: 'destination', label: 'Proveedores', component: Proveedores },
        { path: '/servicios', icon: 'wizard', label: 'Servicios', component: Servicios },
      ],
    },
    {
      path: `${appRoot}/factuación`,
      label: 'Factuación',
      icon: 'book',
      protected: true,
      subs: [
        { path: '/facturas', icon: 'content', label: 'Facturas', component: Facturas },
        { path: '/transacciones', icon: 'book-open', label: 'Transacciones', component: Transacciones },
      ],
    },
  ],
  sidebarItems: [],
};
export default routesAndMenuItems;

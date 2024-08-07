import { DEFAULT_PATHS } from 'config.js';
import Citas from 'views/admin/Citas/Citas';
import Dashboard from 'views/admin/Dashboard';
import Facturas from 'views/admin/Facturas/Facturas';
import Marcas from 'views/admin/Inventario/Marcas/Marcas';
import Gastos from 'views/admin/Facturas/Gastos/Gastos';
import Productos from 'views/admin/Inventario/Productos/Productos';
import Stock from 'views/admin/Inventario/Stock';
import Proveedores from 'views/admin/Inventario/Proveedores/Proveedores';
import Inventario from 'views/admin/Inventario/Inventario';
import Roles from 'views/admin/Usuarios/Roles';
import Usuarios from 'views/admin/Usuarios/Usuarios';
import Pagos from 'views/admin/Facturas/Pagos/Pagos';
import { AppointmentsClient } from 'views/publicViews/AppointmentsClient';
import { ServicesView } from 'views/admin/Inventario/Services/ServicesView';
import { HomeView } from 'views/publicViews/HomeView';
import Categorias from 'views/admin/Inventario/Categorias/Categorias';
import { Notificacions } from 'views/admin/Inventario/Notifications/Notificacions';
import { Tutoriales } from 'views/admin/Tutoriales/Tutoriales';

const appRoot = DEFAULT_PATHS.APP.endsWith('/') ? DEFAULT_PATHS.APP.slice(1, DEFAULT_PATHS.APP.length) : DEFAULT_PATHS.APP;

const routesAndMenuItems = {
  mainMenuItems: [
    {
      path: `${appRoot}/dashboard`,
      label: 'menu.dashboard',
      icon: 'dashboard-1',
      component: Dashboard,
      protected: true,
      hideInMenu: true,
      exact: true
    },
    {
      path: `${appRoot}/admin/citas`,
      label: 'Citas',
      icon: 'check-square',
      component: Citas,
      protected: true,
      exact: true
    },
    {
      path: `${appRoot}/usuarios`,
      label: 'menu.usuarios',
      protected: true,
      exact: true,
      icon: 'laptop',
      subs: [
        { path: '/users', exact: true, icon: 'user', label: 'menu.users', roles: 'R_USERS', component: Usuarios },
        { path: '/roles', exact: true, icon: 'diagram-1', label: 'menu.roles', roles: 'R_ROLES', component: Roles },
      ],
    },
    {
      path: `${appRoot}/inventariado`,
      label: 'inventory.title',
      icon: 'database',
      exact: true,
      subs: [
        { path: '/inventario', exact: true, icon: 'file-text', label: 'Movimientos Inventario', roles: 'R_INVENTORY', component: Inventario },
        { path: '/categories', exact: true, icon: 'dropdown', label: 'Categorias', roles: 'R_CATEGORIES', component: Categorias },
        { path: '/brands', exact: true, icon: 'dropdown', label: 'Marcas', roles: 'R_BRANDS', component: Marcas },
        { path: '/products', exact: true, icon: 'gift', label: 'Productos', roles: 'R_PRODUCTS', component: Productos },
        { path: '/providers', exact: true, icon: 'destination', label: 'Proveedores', roles: 'R_PROVIDERS', component: Proveedores },
        { path: '/servicios', exact: true, icon: 'wizard', label: 'Servicios', roles: 'R_SERVICES', component: ServicesView },
        { path: '/stock', exact: true, icon: 'wizard', label: 'Inventario', roles: 'R_PRODUCTS', component: Stock },
        { path: '/notifications', exact: true, icon: 'bell', label: 'Notificaciones', roles: 'R_PRODUCTS', component: Notificacions },
      ],
      protected: true,
    },
    {
      path: `${appRoot}/facturación`,
      label: 'Facturación',
      icon: 'book',
      protected: true,
      exact: true,
      subs: [
        { path: '/gastos', exact: true, icon: 'content', label: 'Gastos', roles: 'R_BILLS', component: Gastos },
        { path: '/facturas', exact: true, icon: 'content', label: 'Facturas', roles: 'R_BILLS', component: Facturas },
        { path: '/pagos',exact: true, icon: 'book-open', label: 'Pagos', component: Pagos },
      ],
    },
    {
      path: `${appRoot}/citas`,
      label: 'appointments.menuTitle',
      icon: 'check-square',
      component: AppointmentsClient,
      publicOnly: true,
      exact: true
    },
    {
      path: '/',
      component: HomeView,
      publicOnly: true,
      exact: true
    },
    {
      path: `${appRoot}/admin/tutoriales`,
      label: 'Tutoriales',
      icon: 'file-video',
      component: Tutoriales,
      protected: true,
      exact: true
    },
  ],
  sidebarItems: [],
};
export default routesAndMenuItems;

import { DEFAULT_PATHS } from 'config.js';
import Citas from 'views/admin/Citas/Citas';
import Dashboard from 'views/admin/Dashboard';
import Facturas from 'views/admin/Facturas/Facturas';
import Transacciones from 'views/admin/Facturas/Transacciones';
import Categorias from 'views/admin/Inventario/Categorias';
import Marcas from 'views/admin/Inventario/Marcas';
import Gastos from 'views/admin/Facturas/Gastos';
import Productos from 'views/admin/Inventario/Productos';
import Stock from 'views/admin/Inventario/Stock';
import Proveedores from 'views/admin/Inventario/Proveedores';
import Inventario from 'views/admin/Inventario/Inventario';
import Servicios from 'views/admin/Inventario/Services/ServicesView2';
import Roles from 'views/admin/Usuarios/Roles';
import Usuarios from 'views/admin/Usuarios/Usuarios';
import Logs from 'views/admin/Logs/Logs';
import Pagos from 'views/admin/Facturas/Pagos';
import Notificaciones from 'views/admin/Inventario/Notificacion';
import { AppointmentsClient } from 'views/publicViews/AppointmentsClient';

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
        { path: '/users', icon: 'user', label: 'menu.users', roles: 'R_USERS', component: Usuarios },
        { path: '/roles', icon: 'diagram-1', label: 'menu.roles', roles: 'R_ROLES', component: Roles },
      ],
    },
    {
      path: `${appRoot}/inventariado`,
      label: 'inventory.title',
      icon: 'database',
      subs: [
        { path: '/inventario', icon: 'file-text', label: 'Inventario', roles: 'R_INVENTORY', component: Inventario },
        { path: '/categories', icon: 'dropdown', label: 'Categorias', roles: 'R_CATEGORIES', component: Categorias },
        { path: '/brands', icon: 'dropdown', label: 'Marcas', roles: 'R_BRANDS', component: Marcas },
        { path: '/products', icon: 'gift', label: 'Productos', roles: 'R_PRODUCTS', component: Productos },
        { path: '/providers', icon: 'destination', label: 'Proveedores', roles: 'R_PROVIDERS', component: Proveedores },
        { path: '/servicios', icon: 'wizard', label: 'Servicios', roles: 'R_SERVICES', component: Servicios },
        { path: '/stock', icon: 'wizard', label: 'Stock', roles: 'R_PRODUCTS', component: Stock },
        { path: '/notifications', icon: 'bell', label: 'Notificaciones', roles: 'R_PRODUCTS', component: Notificaciones },
      ],
    },
    {
      path: `${appRoot}/facturación`,
      label: 'Facturación',
      icon: 'book',
      protected: true,
      subs: [
        { path: '/gastos', icon: 'content', label: 'Gastos', roles: 'R_BILLS', component: Gastos },
        { path: '/facturas', icon: 'content', label: 'Facturas', roles: 'R_BILLS', component: Facturas },
        { path: '/transacciones', icon: 'book-open', label: 'Transacciones', roles: 'R_TRANSACTIONS', component: Transacciones },
        { path: '/pagos', icon: 'book-open', label: 'Pagos', component: Pagos },
      ],
    },
    {
      path: `${appRoot}/cliente/citas`,
      label: 'appointments.menuTitle',
      icon: 'check-square',
      component: AppointmentsClient,
      protected: false,
    },
    {
      path: `${appRoot}/logs`,
      label: 'Logs',
      icon: 'logs-1',
      component: Logs,
      protected: true,
    },
  ],
  sidebarItems: [],
};
export default routesAndMenuItems;

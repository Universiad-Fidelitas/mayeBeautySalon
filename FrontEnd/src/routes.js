import { DEFAULT_PATHS } from 'config.js';

import HorizontalPage from 'views/Horizontal';
import VerticalPage from 'views/Vertical';

const appRoot = DEFAULT_PATHS.APP.endsWith('/') ? DEFAULT_PATHS.APP.slice(1, DEFAULT_PATHS.APP.length) : DEFAULT_PATHS.APP;

const routesAndMenuItems = {
  mainMenuItems: [
    {
      path: DEFAULT_PATHS.APP,
      exact: true,
      redirect: true,
      to: `${appRoot}/horizontal`,
    },
    {
      path: `${appRoot}/horizontal`,
      component: HorizontalPage,
      label: 'menu.horizontal',
      icon: 'grid-2',
    },
    {
      path: `${appRoot}/vertical`,
      label: 'menu.vertical',
      icon: 'grid-3',
      component: VerticalPage,
    },
  ],
  sidebarItems: [],
};
export default routesAndMenuItems;

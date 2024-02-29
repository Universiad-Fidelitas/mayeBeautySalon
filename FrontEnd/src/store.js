// import redux and persist plugins
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'reduxjs-toolkit-persist';
import storage from 'reduxjs-toolkit-persist/lib/storage';
import persistStore from 'reduxjs-toolkit-persist/es/persistStore';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'reduxjs-toolkit-persist/es/constants';

// import theme reducers
import settingsReducer from 'settings/settingsSlice';
import layoutReducer from 'layout/layoutSlice';
import langReducer from 'lang/langSlice';
import menuReducer from 'layout/nav/main-menu/menuSlice';
import notificationReducer from 'layout/nav/notifications/notificationSlice';
import scrollspyReducer from 'components/scrollspy/scrollspySlice';
import authReducer from 'store/slices/authSlice';
import rolsReducer from 'store/roles/rolsSlice';
import brandsReducer from 'store/brands/brandsSlice';
import usersReducer from 'store/users/usersSlice';
import inventoryReducer from 'store/inventory/inventorySlice';
import categoriesReducer from 'store/categories/categoriesSlice';
import productsReducer from 'store/products/productsSlice';
import providersReducer from 'store/providers/providersSlice';
import stockReducer from 'store/stock/stockSlice';

// import persist key
import { REDUX_PERSIST_KEY } from 'config.js';
import calendarReducer from 'views/admin/Citas/calendarSlice';
import appointmentsReducer from 'store/appointments/appointmentsSlice';

const persistConfig = {
  key: REDUX_PERSIST_KEY,
  storage,
  whitelist: ['menu', 'settings', 'lang', 'auth'],
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    settings: settingsReducer,
    layout: layoutReducer,
    lang: langReducer,
    auth: authReducer,
    rols: rolsReducer,
    brands: brandsReducer,
    stock: stockReducer,
    users: usersReducer,
    inventory: inventoryReducer,
    products: productsReducer,
    providers: providersReducer,
    categories: categoriesReducer,
    menu: menuReducer,
    notification: notificationReducer,
    scrollspy: scrollspyReducer,
    calendar: calendarReducer,
    appointments: appointmentsReducer,
  })
);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
const persistedStore = persistStore(store);
export { store, persistedStore };

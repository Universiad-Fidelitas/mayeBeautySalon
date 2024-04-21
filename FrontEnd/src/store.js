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
import expensesReducer from 'store/expenses/expensesSlice';
import usersReducer from 'store/users/usersSlice';
import inventoryReducer from 'store/inventory/inventorySlice';
import categoriesReducer from 'store/categories/categoriesSlice';
import notificationsReducer from 'store/notifications/notificationsSlice';
import stockReducer from 'store/stock/stockSlice';
import reportsReducer from 'store/reports/reportsSlice';
import reports2Reducer from 'store/reports/reports2Slice';
import reports3Reducer from 'store/reports/reports3Slice';
// import persist key
import { REDUX_PERSIST_KEY } from 'config.js';
import calendarReducer from 'views/admin/Citas/calendarSlice';
import appointmentsReducer from 'store/appointments/appointmentsSlice';
import billsReducer from 'store/bills/billsSlice';

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
    stock: stockReducer,
    users: usersReducer,
    expenses: expensesReducer,
    inventory: inventoryReducer,
    categories: categoriesReducer,
    reports: reportsReducer,
    reports2: reports2Reducer,
    reports3: reports3Reducer,
    menu: menuReducer,
    notification: notificationReducer,
    notifications: notificationsReducer,
    scrollspy: scrollspyReducer,
    calendar: calendarReducer,
    appointments: appointmentsReducer,
    bills: billsReducer,
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

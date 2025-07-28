import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "../features/api/apiSlice";
import { exportApiSlice } from "../features/api/exportApi";

import loaderReducer from "../features/loader/loaderSlice";
import authReducer from "../features/authenticate/authSlice";
import logoutModalReducer from "../features/logoutModal/logoutModalSlice";
import transactionViewAndUpdateModalReducer from "../features/TransactionModals/viewAndUpdateModal";
import deleteTransactionModalReducer from "../features/TransactionModals/deleteModal";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [exportApiSlice.reducerPath]: exportApiSlice.reducer,
    loader: loaderReducer,
    auth: authReducer,
    logoutModal: logoutModalReducer,
    transactionViewAndUpdateModal: transactionViewAndUpdateModalReducer,
    deleteTransactionModal: deleteTransactionModalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these field paths in the state
        ignoredPaths: ['items.dates'],
      },
    }).concat(apiSlice.middleware, exportApiSlice.middleware),
});

setupListeners(store.dispatch);
export default store;

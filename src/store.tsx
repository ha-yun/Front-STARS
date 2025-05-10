import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "./slices/loginSlice";

const store = configureStore({
    reducer: {
        loginSlice: loginSlice,
    },
});

// AppDispatch 타입 export
export type AppDispatch = typeof store.dispatch;
export default store;

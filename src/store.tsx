import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "./slices/loginSlice";

const store = configureStore({
    reducer: {
        loginSlice: loginSlice,
    },
});

// AppDispatch 타입 export
export type AppDispatch = typeof store.dispatch;
// RootState 타입 export 추가
export type RootState = ReturnType<typeof store.getState>;

export default store;

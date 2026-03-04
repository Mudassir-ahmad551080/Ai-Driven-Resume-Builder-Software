import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        // FIX: Remove JSON.parse for the token. 
        // We assume the token is stored as a plain string.
        token: localStorage.getItem("token") || null,
        
        // User is an object, so we still need JSON.parse here
        user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
        loading: false // Changed to false so it doesn't block the UI on load
    },
    reducers: {
        login: (state, action) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            
            // FIX: Save token directly as a string (no JSON.stringify needed)
            localStorage.setItem("token", action.payload.token);
            // User is an object, so we keep stringify
            localStorage.setItem("user", JSON.stringify(action.payload.user));
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
});

export const {login, logout, setLoading} = authSlice.actions;

export default authSlice.reducer;
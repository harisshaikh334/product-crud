import { defineStore } from "pinia";
import {ref} from "vue";

export const userAuthStore = defineStore("authStore", () => {
    const user =ref(null);
    const isAuth = ref(false)
    const setUserLogin = (auth) => {
        isAuth.value = auth;
    }

    const initializeAuth = () => {
        const storeUser = localStorage.getItem('user');
        if (storeUser) {
            isAuth.value = true;
        } else {
            isAuth.value = false;
        }
  };

    return {user, setUserLogin, isAuth, initializeAuth};
})
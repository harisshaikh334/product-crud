
<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div class="container-fluid">
            <RouterLink class="navbar-brand" to="/home">CRUD App</RouterLink>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul v-if="authStore.isAuth" class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/add-product">Add Product</RouterLink>
                    </li>
                </ul>
                <ul v-if="!authStore.isAuth" class="navbar-nav ms-auto mb-2 mb-lg-0" id="authLinks">
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/login">Login</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/register">Sign Up</RouterLink>
                    </li>
                </ul>
                <ul v-if="authStore.isAuth" class="navbar-nav ms-auto mb-2 mb-lg-0" id="authLinks">
                    <li class="nav-item">
                        <button @click="handleLogout" class="nav-link" >Logout</button>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>
<script setup>
import { userAuthStore } from "@/stores/authStore";
import {RouterLink, useRouter} from "vue-router";
const authStore = userAuthStore();
const router = useRouter();
const handleLogout = () => {
    authStore.setUserLogin(false);
    localStorage.removeItem("user");
    router.push("/login");
}
const setTheme = (themeName) => {
    console.log(themeName);
}
console.log("auth store is ", authStore.isAuth);
</script>
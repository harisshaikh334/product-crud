import AddProduct from "@/views/AddProduct.vue";
import Login from "@/views/Login.vue";
import ProductList from "@/views/ProductList.vue";
import SignUp from "@/views/SignUp.vue";
import NotFound from "@/views/NotFound.vue";
import {createRouter, createWebHistory} from "vue-router";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "Login",
            component: Login
        },
        {
            path: "/login",
            name: "login",
            component: Login
        },
        {
            path: "/register",
            name: "Register",
            component: SignUp
        },
        {
            path: "/home",
            name: "Product-list",
            component: ProductList
        },
        {
            path: "/add-product",
            name: "add-product",
            component: AddProduct
        },
        {
            path: "/update-product/:id",
            name: "update-product",
            component: AddProduct
        },
        {
            path: "/:pathMatch(.*)*",
            name: "not-found",
            component : NotFound
        }
    ]
})

export default router;
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
            meta: { requiresAuth: true },
            component: ProductList
        },
        {
            path: "/add-product",
            name: "add-product",
            meta: { requiresAuth: true },
            component: AddProduct
        },
        {
            path: "/update-product/:id",
            name: "update-product",
            meta: { requiresAuth: true },
            component: AddProduct
        },
        {
            path: "/:pathMatch(.*)*",
            name: "not-found",
            meta: { requiresAuth: true },
            component : NotFound
        }
    ]
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = localStorage.getItem('user'); 
  console.log("to and from ", to, from);
  if (requiresAuth && !isAuthenticated) {
    next("/login"); 
  } else if ((to.fullPath === '/login' || to.fullPath === '/register') && isAuthenticated) {
    next("/home");
  } else {
    next();
  }
});

router.afterEach(() => {
  // Get the navbar collapse element
  const navbarCollapse = document.getElementById('navbarNav');

  
  if (navbarCollapse && navbarCollapse.classList.contains('show')) {
   
    if (window.bootstrap && window.bootstrap.Collapse) {
      const bsCollapse = new window.bootstrap.Collapse(navbarCollapse, { toggle: false });
      bsCollapse.hide();
    } else {
      navbarCollapse.classList.remove('show');
      const navbarToggler = document.querySelector('.navbar-toggler');
      if (navbarToggler) {
        navbarToggler.setAttribute('aria-expanded', 'false');
      }
    }
  }
});



export default router;
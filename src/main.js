
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import router from './routes/routes';
import { userAuthStore } from './stores/authStore'

const app = createApp(App);
app.use(router);
app.use(createPinia());
const authStore = userAuthStore();
authStore.initializeAuth();
app.mount('#app')

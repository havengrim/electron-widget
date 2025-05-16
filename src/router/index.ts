import { createWebHistory, createRouter } from "vue-router";
import About from "../components/About.vue";
import Dashboard from "../components/Dashboard.vue"
import Generate from "../components/Generate.vue"
import Login from "../components/Login.vue"
const routes = [
    {
        path: "/login",
        name: "Login",
        component: Login,
    },
    {
        path: "/",
        name: "Dashboard",
        component: Dashboard,
    },
    {
        path: "/about",
        name: "About",
        component: About,
    },
       {
        path: "/generate",
        name: "Generate",
        component: Generate,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
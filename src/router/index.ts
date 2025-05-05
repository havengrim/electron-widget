import { createWebHistory, createRouter } from "vue-router";
import About from "../components/About.vue";
import App from "../App.vue"
const routes = [
    {
        path: "/",
        name: "App",
        component: App,
    },
    {
        path: "/about",
        name: "About",
        component: About,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
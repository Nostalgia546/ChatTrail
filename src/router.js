// router.js
import { createRouter, createWebHistory } from "vue-router";
import index from "./components/index.vue";

const routes = [
    {
        path: "/index",
        name: "index",
        component: index,
    },
    {
        path: "/",
        redirect: "/index",
    },

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;

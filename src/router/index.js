import { createRouter, createWebHistory } from "vue-router";

import Competitions from "../views/Competitions.vue";

const routes = [
    {
        path: '/',
        redirect: '/competitions'
    },
    {
        path: '/competitions',
        name: 'Competitions',
        component: Competitions
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
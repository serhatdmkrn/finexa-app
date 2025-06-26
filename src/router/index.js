import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
    {
        name: "LOGIN",
        path: "/login",
        component: () => import("../views/Auth/Login.vue")
    },
    {
        name: "REGISTER",
        path: "/register",
        component: () => import("../views/Auth/Register.vue")
    },
    {
        name: "RESETPASSWORD",
        path: "/reset-password/:token",
        component: () => import("../views/Auth/ResetPassword.vue")
    },
    {
        name: "HOMEPAGE",
        path: "/",
        component: () => import("../views/Home.vue")
    },
    {
        name: "ACCOUNT",
        path: "/account",
        component: () => import("../views/Account.vue")
    },
    {
        name: "CONTACT",
        path: "/contact",
        component: () => import("../views/Contact.vue")
    },
    {
        name: "KVKK",
        path: "/kvkk",
        component: () => import("../views/Kvkk.vue")
    },
    {
        name: "ABOUTUS",
        path: "/about-us",
        component: () => import("../views/AboutUs.vue")
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;

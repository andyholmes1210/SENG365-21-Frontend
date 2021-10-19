import { createApp } from 'vue';
import { createWebHistory, createRouter } from 'vue-router';
import axios from 'axios';
import Events from "./Events.vue";
import App from './App.vue';
import RegisterGetImageUser from './RegisterGetImageUser.vue';
import Login from './Login.vue';
import ElementPlus from 'element-plus';
import UserProfile from "./UserProfile";

const routes = [
    {
        path: "/",
        name: "home",
        component: RegisterGetImageUser
    },
    {
        path: "/login",
        name: "login",
        component: Login
    },
    {
        path: "/profile",
        name: "profile",
        component: UserProfile
    },
    {
        path: "/events",
        name: "events",
        component: Events
    },
    {
        path: "/events/:eventId",
        name: "event",
        component: Events

    }
];


const router = createRouter({
    routes,
    history: createWebHistory()
});


const app = createApp(App);
app.use(router);
app.config.globalProperties.axios = axios;
app.mount('#app');
app.use(ElementPlus);

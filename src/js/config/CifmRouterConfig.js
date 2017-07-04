import Vue from 'vue';
import VueRouter from 'vue-router';
import Cifm from '../../vue/cifm/Cifm.vue';
import Database from '../../vue/cifm/database/Index.vue';
import Link from '../../vue/cifm/link/Index.vue';

Vue.use(VueRouter);
const routes = [
    {path: '/', component: Cifm},
    {path: '/database', component: Database},
    {path: '/link', component: Link},
], router = new VueRouter({
    routes
});

export default router;

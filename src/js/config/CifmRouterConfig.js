import Vue from 'vue';
import VueRouter from 'vue-router';
import Cifm from '../../vue/Cifm.vue';

Vue.use(VueRouter);
const routes = [
    {path: '/', component: Cifm}
], router = new VueRouter({
    routes
});

export default router;

import Vue from 'vue';
import VueRouter from 'vue-router';
import Dept from '../../vue/dept/Dept.vue';

Vue.use(VueRouter);
const routes = [
    {path: '/', component: Dept},
], router = new VueRouter({
    routes
});

export default router;

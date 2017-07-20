import Vue from 'vue';
import VueRouter from 'vue-router';
import Dept from '../../vue/dept/Dept.vue';
import Result from '../../vue/dept/Result.vue';

Vue.use(VueRouter);
const routes = [
    {path: '/', component: Dept},
    {path: '/result/:score/:riskName', component: Result},
], router = new VueRouter({
    routes
});

export default router;

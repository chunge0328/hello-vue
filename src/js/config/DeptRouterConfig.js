import Vue from 'vue';
import VueRouter from 'vue-router';
import Dept from '../../vue/dept/Dept.vue';
import Result from '../../vue/dept/Result.vue';

Vue.use(VueRouter);
const routes = [
<<<<<<< HEAD
    {path: '/', component: Dept},
    {path: '/result/:score/:riskName', component: Result},
=======
    {path: '/', component: Dept}
>>>>>>> b737e1e5eb789ee51f5331e88f2a5a56c5b90f3b
], router = new VueRouter({
    routes
});

export default router;

import Vue from 'vue';
import VueRouter from 'vue-router';
import Turntable from '../../vue/red/Turntable.vue';
import Coupons from '../../vue/red/Coupons.vue';
import Login from '../../vue/red/Login.vue';
import OneLogin from '../../vue/red/OneLogin.vue';

Vue.use(VueRouter);
const routes = [
    {path: '/turntable', component: Turntable},
    {path: '/turntable/:mobile', component: Turntable},
    /*{ path: '/coupons', component: Coupons },*/
    {path: '/coupons/:mobile', component: Coupons},
    /*{ path: '/login', component: Login },
     { path: '/login/:mobile', component: Login },*/
    {path: '/oneLogin', component: OneLogin},
    {path: '/oneLogin/:mobile', component: OneLogin}
], router = new VueRouter({
    routes
});

export default router;

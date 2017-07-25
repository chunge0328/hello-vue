import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);
const routes = [
    {
        path: '/', component: require('../../vue/investigates/Investigates.vue')
    }, {
        path: '/success', component: require('../../vue/investigates/Success.vue')
    }
], router = new VueRouter({
    routes
});

export default router;

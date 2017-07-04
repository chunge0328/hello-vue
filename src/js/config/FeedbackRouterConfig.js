import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);
const routes = [
    {
        path: '/', component: require('../../vue/feedback/Feedback.vue')
    }
], router = new VueRouter({
    routes
});

export default router;

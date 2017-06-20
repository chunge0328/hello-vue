import Vue from 'vue';
import VueRouter from 'vue-router';
import One from '../../vue/One.vue';
import OneIndex from '../../vue/OneIndex.vue';
import Fof from '../../vue/Fof.vue';
import Point from '../../vue/Point.vue';
import Topic from '../../vue/Topic.vue';
import TopicDetail from '../../vue/TopicDetail.vue';

Vue.use(VueRouter);
const routes = [
    {path: '/', component: One},
    {path: '/one/:mobile', component: One},
    {path: '/oneIndex/:mobile/:mobileCode', component: OneIndex},
    {path: '/fof/:mobile/:mobileCode', component: Fof},
    {path: '/point', component: Point},
    {path: '/point/:mobile', component: Point},
    {path: '/topic', component: Topic},
    {path: '/topic/:mobile', component: Topic},
    {path: '/topicDetail', component: TopicDetail},
    {path: '/topicDetail/:mobile/:id/:author/:content', component: TopicDetail}
], router = new VueRouter({
    routes
});

export default router;

import Vue from 'vue';
import VueRouter from 'vue-router';
import One from '../../vue/one/One.vue';
import OneIndex from '../../vue/one/OneIndex.vue';
import Fof from '../../vue/one/Fof.vue';
import Point from '../../vue/one/Point.vue';
import Topic from '../../vue/one/Topic.vue';
import TopicDetail from '../../vue/one/TopicDetail.vue';
import Question from '../../vue/one/Question.vue';

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
    {path: '/topicDetail/:mobile/:id/:author/:content', component: TopicDetail},
    {path: '/question', component: Question},
    {path: '/question/:mobile', component: Question}
], router = new VueRouter({
    routes
});

export default router;

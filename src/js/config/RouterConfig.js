import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const routes = [
    {
        path: '/', component: require('Vue/Index')
    }
], router = new VueRouter({
    routes
})

export default router

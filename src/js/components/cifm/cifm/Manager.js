import Vue from 'vue';

export default {
    install(Vue, options) {
        /*Vue.myGlobalMethod = function () {
        }*/
        /*Vue.directive('p-dir', {
            bind (el, binding, vnode, oldVnode) {
                console.info(el)
            }
        })*/
        Vue.component("manager", require("../../../../vue/cifm/cifm/Manager.vue"));
        // 3. 注入组件
        Vue.mixin({
            data(){
                return {};
            },
            created(){
                "use strict";
            }
        });
        /*Vue.prototype.$myMethod = function (options) {
            console.info("$myMethod");
        }*/
    }
}
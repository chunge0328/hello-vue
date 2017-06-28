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
        Vue.component("pchSvn", require("../../../../vue/cifm/svn/Index.vue"));
        Vue.component("svModify", require("../../../../vue/cifm/svn/Modify.vue"));
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
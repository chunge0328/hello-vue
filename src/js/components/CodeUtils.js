import Vue from 'vue';

export default {
    install(Vue, options) {
        Vue.component("codeUtils", require("../../vue/common/CodeUtils"));
        Vue.mixin({
            data(){
                return {};
            },
            created(){
                "use strict";
            }
        });
    }
}
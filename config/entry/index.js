import Vue from 'vue';
import $ from '../../src/js/utils/Util';
import router from '../../src/js/config/IndexRouterConfig';
require('./../../src/js/config/IndexRequestConfig');


/*debugger*/
console.info("process.env.PRODUCTION => " + process.env.PRODUCTION);
/*debugger...end*/

const app = new Vue({
    router
}).$mount($("div", {class: "container"}).html("<router-view></router-view>").appendTo(document.body)[0]);

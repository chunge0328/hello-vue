import Vue from 'vue';
import Util from 'Js/utils/Util';
import router from 'Js/config/RouterConfig';
require('./src/js/config/RequestConfig')

/*debugger*/
console.info("process.env.PRODUCTION => " + process.env.PRODUCTION);
/*debugger...end*/

const app = new Vue({
    router
}).$mount(Util("div", {}).html("<router-view></router-view>").appendTo(document.body)[0]);

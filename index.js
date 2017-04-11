import Vue from 'vue';
import Util from './src/js/utils/Util';
import router from './src/js/config/RouterConfig';
require('./src/js/config/RequestConfig');


/*debugger*/
console.info("process.env.PRODUCTION => " + process.env.PRODUCTION);
/*debugger...end*/

const app = new Vue({
    router
}).$mount(Util("div", {class: "container"}).html("<router-view></router-view>").appendTo(document.body)[0]);

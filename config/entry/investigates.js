import Vue from 'vue';
import $ from '../../src/js/utils/Util';
import router from '../../src/js/config/InvestigatesRouterConfig';
require('./../../src/js/config/InvestigatesRequestConfig');


/*debugger*/
console.info("process.env.PRODUCTION => " + process.env.PRODUCTION);
/*debugger...end*/

[{name: "viewport", content: "initial-scale=1,maximum-scale=1,user-scalable=no"}, {
    name: "apple-mobile-web-app-capable",
    content: "yes"
}, {name: "apple-mobile-web-app-status-bar-style", content: "black"},
    {name: "format-detection", content: "telephone=no"}, {
    name: "format-detection",
    content: "email=no"
}].map(function (attr, index, arr) {
    $("meta").attr(attr).appendTo(document.head);
});

const app = new Vue({
    router
}).$mount($("div", {class: "container"}).html("<router-view></router-view>").appendTo(document.body)[0]);

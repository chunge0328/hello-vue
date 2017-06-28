import Vue from 'vue';
import VueResource from 'vue-resource';

Vue.use(VueResource);

Vue.http.interceptors.push(function (request, next) {
    let url = request.url;
    if (/^http.+/ig.test(url)) {
    } else if (/^\/.+/ig.test(url)) {
        url = process.env.BASE_PATH + url;
    } else if (/^[^\/]]+/) {
        url = process.env.BASE_PATH + "/" + url;
    }
    request.url = url;
    next(function (response) {
    });
});/*modify requestUrl => end*/
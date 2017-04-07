/**
 * Created by uo712 on 2017/4/7.
 */

export default (function (undefined) {
    let Util = function (selector, context) {
        return new Util.fn.init(selector, context);
    }
    Util.fn = Util.prototype = {
        init: function () {
            console.info(arguments[0]);
        }
    };
    return Util;
})();
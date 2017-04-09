/**
 * Created by uo712 on 2017/4/7.
 */

export default (function (undefined) {
    let Util = function (selector, context) {
        return new Util.fn.init(selector, context);
    }
    Util.fn = Util.prototype = {
        init() {
            let sel = arguments[0], attr = arguments[1];
            let ele = document.createElement(sel);
            for (let i in attr) {
                ele.setAttribute(i, attr[i]);
            }
            Util.fn[0] = ele;
            return Util.fn;
        }
    };

    let ext = {
        html() {
            let con = arguments[0];
            this[0].innerHTML = con;
            return this;
        },
        appendTo() {
            let tar = arguments[0];
            tar.appendChild(this[0]);
            return this;
        }
    };
    for (let i in ext) {
        Util.fn[i] = ext[i]
    }

    return Util;
})();
export default (function (undefined) {
    let Util = function (selector, context) {
        return new Util.fn.init(selector, context);
    }

    Util.fn = Util.prototype = {
        constructor: "Util",
        init() {
            let sel = arguments[0], attr = arguments[1], type = Util.type(sel), ele = null;
            if(type === "string") {
                ele = document.createElement(sel);
                for (let i in attr) {
                    ele.setAttribute(i, attr[i]);
                }
            }else if(type === "element"){
                ele = sel;
            }
            Util.fn[0] = ele;
            return Util.fn;
        }
    };
    Util.extend = Util.fn.extend = function (opt) {
        for(let i in opt) {
            this[i] = opt[i];
        }
    }

    function findElementByAttr(ele, attr) {
        if(ele != null && ele.getAttribute) {
            let attrVal = ele.getAttribute(attr);
            if(attrVal) return ele;
            else return findElementByAttr.call(this, ele.parentNode, attr);
        }else{
            return Util.fn[0];
        }

    }


    Util.fn.extend({
        html() {
            let con = arguments[0];
            this[0].innerHTML = con;
            return this;
        },
        appendTo(tar) {
            tar.appendChild(this[0]);
            return this;
        },
        closest(sel){
            let attrReg = /\[(.+?)\]/ig, resArr = attrReg.exec(sel);
            if(resArr.length > 1) {
                let oriEle = this[0] ,selNew = resArr[1];
                this[0] = findElementByAttr(oriEle.parentNode, selNew);
            }
            return this;
        },
        attr(attr) {
            switch (Util.type(attr)) {
                case "string":
                    return this[0].getAttribute(attr);
                    break;
                case "object":
                    for(let i in attr) {
                        this[0].setAttribute(i, attr[i]);
                    }
                    return this;
                    break;
                default:
                    return this;
            }
        }
    });

    Util.extend({
        type(arg){
            return {
                "[object String]": "string",
                "[object Array]": "array",
                "[object Object]": "object",
                "[object HTMLInputElement]": "element"
            }[Object.prototype.toString.call(arg)];
        }
    });
    return Util;
})();
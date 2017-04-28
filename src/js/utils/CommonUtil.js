/**
 * Created by uo712 on 2017/3/22.
 */

export const Util = {
    recursion() {
        if(!arguments || arguments.length == 0) return "";
        var arg = arguments[0];
        if (arg.length == 0) return "";
        var str = "";
        for (let i = 0; i < arg.length; i++) {
            if (i == 0) {
                str += "arg[0].call(this"
            } else {
                str += ", arg[" + i + "]";
            }
        }
        str += ")";
        try{
            eval(str);
        }catch (e){}
        return str.replace(/arg/ig, "arguments");
    },
    getPureNum(str) {
        let exe = /[\d\.\$]+/ig.exec(str)
        if(exe && exe.length > 0) return exe[0]
        return str
    },
    getLastSymbol(str) {
        let exe = /[^\d\.\$]+/ig.exec(str)
        if(exe && exe.length > 0 && Util.getPureNum(str) != str) return exe[0]
        return ''
    },
    convertSymbol(str){
        return str.replace(/\\n/ig, "<br/>");
    }
}
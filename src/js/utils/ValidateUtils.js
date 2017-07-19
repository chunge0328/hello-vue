export const Util = {
    isEmpty(vlaue) {
        if(vlaue == null || vlaue == '' || vlaue == 'undefined'){
            return false;
        }else{
            return true;
        }
    },
    checkMobile(vlaue){
        return /^1\d{10}$/.test(vlaue);
    },
    getDateStr(val){
        /**
         * 三年前：-1080，一年前：-360，半年前：-180,三月前：-90,一月前：-30, 7天前：-7
         * @return 从当前日期返回val前的时间点
         */
        var dd = new Date();
        dd.setDate(dd.getDate()+val);//获取val天后的日期
        var y = dd.getFullYear();
        var m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);//获取当前月份的日期，不足10补0
        var d = dd.getDate()<10?"0"+dd.getDate():dd.getDate();//获取当前几号，不足10补0
        return y+"-"+m+"-"+d;
    }
}
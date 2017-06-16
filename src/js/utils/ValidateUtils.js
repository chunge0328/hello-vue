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
    }
}
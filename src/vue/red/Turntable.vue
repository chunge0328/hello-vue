<style>
    .text_box p {
        color: #FFFFFF;
    }
</style>

<template>
    <div>
        <!--<header id="header" class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">抽奖</h1>
        </header>-->

        <div class="lottery"><!--背景--></div><!--背景...end-->

        <div class="lottery_turnplate"><!--转盘-->
            <div class="lottery_turnplate0" ref="pointer">
                <!--<div v-for="(dat, ind) in items" :class="getTurntableClass(dat, ind)">
                    <span v-if="/\d/ig.test(dat.name)"><ins class="f24 fb">X</ins><i class="f30 fb">{{dat.name.replace(/[^\d]/ig, '')}}</i></span>
                    <span v-else><ins class="f23 fb">谢谢</ins><br/><i class="f20 fb">参与</i></span>
                </div>-->
            </div>
            <!--<div class="lottery_turnplate0" ref="pointer">
                <div class="l_0"><ins class="f24 fb">X</ins><i class="f30 fb">2</i></div>
                <div class="l_1"><ins class="f24 fb">X</ins><i class="f30 fb">4</i></div>
                <div class="l_2"><ins class="f24 fb">X</ins><i class="f30 fb">6</i></div>
                <div class="l_3"><ins class="f24 fb">X</ins><i class="f30 fb">8</i></div>
                <div class="l_4 mui-text-center lh20"><ins class="f23 fb">谢谢</ins><br/><i class="f12 fb">参与</i></div>
            </div>-->
            <span class="lottery_btn pointer" @click="lottery()"></span>
        </div><!--转盘...end-->

        <div class="prize" v-show="luck && item.prize && luckAlert"><!--中奖提示-->
            <!--<div class="prize">&lt;!&ndash;中奖提示&ndash;&gt;-->
            <!--<cite class="p_close" @click="luckAlert = false"></cite>-->
            <p class="f20 c_fff mt138 mui-text-center lh54">
                <ins class="f44">恭喜</ins>
                <br/>
                <ins class="f14">您所获加倍券可将现金宝收益提高</ins>
                <br/>
                <em class="redNum f60">{{Util.getPureNum(item.prize?item.prize.name:"")}}</em>
                <i class="per f45">{{Util.getLastSymbol(item.prize? item.prize.name: "")}}</i>
            </p>
            <button type="button" class="b_f bd f16 cc8 w40 mr" @click="skip('/coupons/'+mobile)">立即使用</button>
        </div><!--中奖提示...end-->

        <div class="lottery_bg"></div>
        <div class="explain_text">*对上投摩根天添盈E类货币基金份额的每万份收益进行加倍</div>

        <div class="draw mr ml" @click="skip2CardList" style="font-size: 22px;width: 140px;"><!--按钮文字-->我的奖券</div><!--按钮文字...end-->

        <div class="p_r c_fff f16 mui-text-center text_tip" @click="scroll2ActRule"><!--往下箭头--><cite
                style="text-decoration: underline;">
            活动规则
        </cite><!--<img src="../img/draw_icon0.png"/>--></div><!--往下箭头...end-->

        <div class="text_bg" ref="actRule"><!--活动规则-->
            <div class="text_box p_r">
                <!--<p class="f_indent">即日起至2017年4月30日，参与活动即有机会获得收益翻倍券，有效期内用券可将账户内上投摩根天添盈E类货币基金份额（000857）的收益加倍。</p>-->
                <p>1. 即日起至2017年4月30日，参与活动即有机会获得收益翻倍券，有效期内用券可将账户内上投摩根天添盈E类货币基金份额（000857）的收益加倍。</p>
                <p>2. 活动期内，每个基金账户仅限使用一张收益翻倍券，收益翻倍倍率为2-8倍。自使用之日起至活动结束日，您持有的上投摩根天添盈E类货币基金份额（000857）的收益将提升相应倍数，收益加倍期间，新增的基金份额亦可享受活动收益。
                </p>
                <p>3. 加倍收益所得将以“收益红包”的形式在活动结束后10个工作日内直接发放至基金账户中。</p>
                <p>4. “收益红包”为上投摩根天添盈E类货币基金份额（000857），红包金额最高为288元。</p>
                <p>5. 活动最终解释权归上投摩根基金所有。</p>
                <p style="font-size:10px;">*注：上投摩根天添盈E类货币基金份额（000857）的收益计算办法参见相关基金公告。</p>
            </div>
        </div><!--活动规则...end-->

        <div class="mui-text-center logo_bg"><!--上投摩根logo-->
            <img src="../../img/draw_icon.png"/>
        </div><!--上投摩根logo...end-->

        <div class="p_bg" v-show="luckAlert || loginVisible"><!--模态框--></div><!--模态框...end-->

        <div class="has_draw" v-show="luck && !item.prize && luckAlert"><!--已抽奖提示-->
            <!--<div class="has_draw">&lt;!&ndash;已抽奖提示&ndash;&gt;-->
            <!--<cite class="h_close" @click="luckAlert=false"></cite>-->
            <p class="f20 c_fff mui-text-center mt40 mb40">温馨提示</p>
            <p class="f23 cc5 mui-text-center mb20">{{lotteryMsg}}</p>
            <button type="button" class="btn_bg bd f16 w40 mr c_fff" @click="skip()">我的奖券</button>
        </div><!--已抽奖提示...end-->

        <div class="prize win hide"><!--未抽中提示-->
            <p class="f20 c_fff mui-text-center mt190 mb20">您抽中了</p>
            <p class="f40 c_fff mui-text-center mb20">谢谢参与</p>
            <button type="button" class="b_f bd f16 w40 mr cc8">我知道了</button>
        </div><!--未抽中提示...end-->

        <div class="has_draw phone_draw" v-show="loginVisible"><!--手机登录-->
            <!--<cite class="h_close" @click="loginVisible=false"></cite>-->
            <p class="f20 c_fff mui-text-center mt40 mb20">填手机 抽奖券</p>
            <ul class="login-box pl10 pr10">
                <li class="hp44 lh44 bb txt_inp_new">
                    <input class="lh24 w100 bd f14" type="text" placeholder="请输入手机号"
                           v-model="mobile">
                    <!--<span class="close" @click="mobile=''">&nbsp;</span>-->
                </li>
                <li class="hp44 lh44 bb txt_inp_new">
                    <input class="lh24 w50 bd f14" type="text" placeholder="请输入短信验证码"
                           v-model="mobileCode">
                    <span class="f14 fr mr20 send pl15 hp26 lh26 mt10 cc3" :class="{'sms_disabled': !sendState}"
                          :disabled="!sendState" @click="sendCode">{{sendText}}</span>
                    <!--<span class="close" @click="mobileCode=''">&nbsp;</span>-->
                </li>
            </ul>
            <button type="button" class="bd f16 w40 c_fff btn_bg bor_radius16 mr ml"
                    @click="appLogin(lottery)"
                    :disabled="mobile.length<11 || mobileCode.length<2">确认
            </button>
        </div><!--手机登录...end-->

    </div>
</template>

<script>

    import 'mint-ui/lib/style.css'
    import '../../css/mui.min.css'
    import '../../css/share.css'
    import '../../css/choiceness.css'
    import Turntable from '../../js/utils/turntable'
    import Vue from 'vue'
    import {Toast, MessageBox, Field, Popup, Actionsheet} from 'mint-ui'
    Vue.component(Field.name, Field);
    Vue.component(Popup.name, Popup);
    Vue.component(Actionsheet.name, Actionsheet);

    import router from '../../js/config/RedRouterConfig'
    import {Util} from '../../js/utils/CommonUtil'

    export default {
        name: 'turntable',
        data () {
            return {
                activityId: process.env.ACTIVITY_ID, /*活动id*/

                Util: Util,

                items: [], /*奖品信息*/
                item: {}, /*中奖信息*/

                mobile: "", /*手机号*/

                loginState: false, /*已经登录？*/
                loginVisible: false, /*显示登录界面？*/

                sendState: true, /*验证码可以发送？*/
                sendText: '获取验证码', /*验证码文字显示*/
                lessSecond: 60, /*倒计时次数*/
                timeGap: 1000, /*间隔时间（毫秒）*/
                mobileCode: "", /*验证码*/

                luck: false, /*抽过奖？*/
                luckAlert: false, /*展示抽奖提示信息？和luck的区别是这个用于展示，而luck用于判断是否调用抽奖接口*/

                taskList: null, /*任务列表*/

                lotteryInfo: "",

                lotteryMsg: "别太贪心哦"
            }
        },
        methods: {
            getTurntableClass(dat, ind){/*获取转盘的class*/
                return "l_" + ind + " " + (dat.itemNum == 0 ? "active" : "");
            },
            skip(path, delay) {/*路由跳转*/
                if (!path) path = "/coupons/" + this.mobile;
                if (delay) {
                    setTimeout(function () {
                        skip.call(this, path);
                    }.bind(this), delay);
                } else {
                    this.luckAlert = false;
                    router.push(path);
                }
            },
            scroll2ActRule(){
                document.body.scrollTop = this.$refs.actRule.offsetTop;
            },
            skip2CardList(){
                if (this.loginState) {
                    this.skip();
                } else {
                    document.body.scrollTop = 0;
                    this.taskList = this.skip;
                    this.loginVisible = true;
                }
            },
            /*发送验证码 => start*/
            sendCode () {
                let msg = this.mobile == "" ? "请先输入手机号码！" : !/^1\d{10}$/.test(this.mobile) ? "电话号码有误,请输入11位手机号！" : "";
                if (msg.length > 0) {
                    Toast(msg);
                    return false;
                } else {
                    if (this.sendState) {
                        this.sendState = false;
                        this.$http.jsonp("/web/sys/user/getCode", {params: {mobile: this.mobile}}).then(function (res) {
                            let data = res.data;
                            Toast(data.success ? "发送成功" : "发送失败，请再试一次");
                        });
                        this.reverseTime(this.lessSecond);
                    }
                }
            },
            reverseTime: function (lessSecond) {/*倒计时*/
                this.sendText = '剩余' + lessSecond-- + '秒';
                if (lessSecond < 0) {
                    this.sendState = true;
                    this.sendText = '获取验证码';
                } else {
                    setTimeout(function () {
                        this.reverseTime.call(this, lessSecond);
                    }.bind(this), this.timeGap)
                }
            },
            /*发送验证码 => end*/
            /*登录 => start*/
            initData(){/*初始化数据*/
                let arg = arguments;
                if (this.$route.params.mobile) this.mobile = this.$route.params.mobile;
                console.info(this.$route.params.mobile)
                try {
                    if (!this.mobile && localStorage.getItem("mobile")) this.mobile = localStorage.getItem("mobile");
                } catch (e) {
                }
                console.info("this.mobile => " + this.mobile);
                Util.recursion(arg);
            },
            checkLogin(){
                let arg = arguments;
                if (this.mobile) {
                    this.$http.jsonp("/web/act/login/checkLogin", {params: {mobile: this.mobile}}).then(function (res) {
                        this.loginState = res.data.success;
                        if (!this.loginState) {
                        } else {/*已经登录*/
                            Util.recursion(arg);
                        }
                    }.bind(this))
                } else {
                    this.loginState = false;
                }
            },
            appLogin(){/*手机登录*/
                let arg = arguments;
                this.$http.jsonp("/web/act/login/login", {
                    params: {
                        mobile: this.mobile,
                        code: this.mobileCode
                    }
                }).then(function (res) {
                    let data = res.data;
                    this.loginState = data.success;
                    this.loginVisible = !data.success;
                    if (this.loginState) {
                        try {
                            localStorage.setItem("mobile", this.mobile);
                        } catch (e) {
                        }
                        let task = this.taskList;
                        if (task) {
                            this.taskList = null;
                            task();
                        }
                        Util.recursion(arg);
                    } else if (data.code == "CIFM_9998") {
                        Toast("验证码错误");
                    } else {
                        Toast("登录失败，请重新发送验证码");
                    }
                }.bind(this));
            },
            /*登录 => end*/
            initItem(){/*初始化奖品信息 => 0)*/
                let arg = arguments;
                if (this.items.length == 0) {
                    this.$http.jsonp("/web/act/prize/list", {params: {activityId: this.activityId}}).then(function (res) {
                        try {
                            this.items = res.data.items;
                            Util.recursion(arg);
                        } catch (e) {
                            Toast("初始化奖品信息失败");
                        }
                    }.bind(this))
                }
            },
            isPrize() {/*是否中奖*/
                let arg = arguments;
                this.$http.jsonp("/web/act/prize/isPrize", {
                    params: {
                        mobile: this.mobile,
                        activityId: this.activityId
                    }
                }).then(function (res) {
                    let data = res.data;
                    if (data.code == "0") {/*未中奖*/
                        Util.recursion(arg);
                    } else {
                        this.luck = true;
//                        this.luckAlert = true;
                    }
                }.bind(this))
            },
            lottery() {/*抽奖*/
                if (!this.loginState) {
                    document.body.scrollTop = 0;
                    this.loginVisible = true;
                    return false;
                }
                if (this.items.length > 0) {
                    if (!this.luck) {
                        this.luck = true;
                        this.$http.jsonp("/web/act/prize/lottery", {
                            params: {mobile: this.mobile, activityId: this.activityId}
                        }).then(function (res) {
                            let data = res.data;
                            if (!data.success && data.code == "CIFM_9998") {
                                this.luckAlert = true;
                                let msg = {
                                    "6": "别太贪心哦",
                                    "0": "谢谢参与",
                                    "-1": "红包被领完了",
                                    "-2": "您今天次数已用完",
                                    "-3": "活动已结束",
                                    "-4": "奖品被领完了"
                                }
//                                console.info(data.data.id + "<>" +msg[data.data.id]);
                                if (data.data.id in msg) {
                                    this.lotteryMsg = msg[data.data.id];
                                } else {
                                    this.lotteryMsg = msg["6"];
                                }
                            } else {
                                let itemInd = -1;
                                this.items.map(function (dat, ind) {
                                    if (data.data.prizeId == dat.id) {
                                        itemInd = ind;
                                    }
                                }.bind(this))
                                this.turntable(itemInd);
                            }
                        }.bind(this), function () {
                            this.luck = false;
                        }.bind(this));
                    } else {
                        this.luckAlert = true;
                    }
                } else {
                    Toast("初始化抽奖信息失败");
                }
            },
            turntable(itemInd){/*转盘开转*/
                console.info("itemInd => " + itemInd);
                new Turntable(this.$refs.pointer, {
                    angle: 0, animateTo: (this.items.length - itemInd) * 360 / this.items.length + 3600,
                    duration: 5 * 1000,
                    callback: function () {
                        this.item.prize = {name: this.items[itemInd].name};
                        this.luckAlert = true;
                    }.bind(this)
                });
            }
        },
        created: function () {
            this.initData(this.initItem, this.checkLogin);
            document.addEventListener("touchmove", function (e) {
                if (this.luckAlert || this.loginVisible) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }.bind(this), false);
        }
    }
</script>

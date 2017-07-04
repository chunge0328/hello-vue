<style>
    body {
        background: #fff;
    }

    .red-list li .no-border{
        border :0px;
    }
</style>
<template>

    <div>

        <div class="tab-box white_bg hp44 lh44 mt44"><!--tab标题-->
            <span v-for="(tab, ind) in tabs" :class="{'active':activeTab == tab}"
                  @click="toggle(ind)">{{tab.title}}</span>
        </div><!--tab标题-->

        <div class="red-cont borderTop"><!--中间内容部分-->

            <div v-show="activeTab == tabs[0]"><!--红包列表-->

                <div class="hint" v-show="activeTab.list.length == 0"><!--空白显示页-->
                    <img src="../../img/hint_icon1.png"/>
                    <p class="c_g pt20 pb30 f24">你的账户，空空如也</p>
                    <a :href="activityHref" class="c_c f12">快去参加活动吧</a>
                </div><!--空白显示页...end-->

                <div class="red-packet" v-show="activeTab.list.length != 0">
                    <ul class="red-list">
                        <mt-loadmore :top-method="loadTopH"
                                     :bottom-method="loadBottomH"
                                     :bottom-all-loaded="tabs[0].allLoaded"
                                     ref="loadmoreH">
                            <li v-for="(data, ind) in activeTab.list"
                                :class="tabs[0].htmlConfig[data.state].liClass">
                                <i class="biao">&yen;</i><em class="redNum f60">{{data.prize.money}}</em>
                                <cite class="green-hands f16 pt10">新手红包</cite>
                                <!--<span class="mui-pull-left f12 ccca money_validity">有效期至：{{formatDate(data.prize.edate)}}</span>-->
                                <p>
                                    <cite :class="tabs[0].htmlConfig[data.state].useBtnClass" @click="usenow(data)">{{tabs[0].htmlConfig[data.state].useBtnText}}</cite>
                                    <span class="mui-pull-left f12 ccb6 mb5">{{data.prize.des}}<br>&nbsp;</span>
                                </p>
                            </li>
                            <div slot="bottom" class="mint-loadmore-bottom">
                                <span v-show="true"></span>
                            </div>
                        </mt-loadmore>
                    </ul>
                </div>
            </div><!--红包列表...end-->

            <div v-show="activeTab == tabs[1]"><!--卡卷列表-->

                <div class="hint Card" v-show="activeTab.list.length == 0"><!--空白显示页-->
                    <img src="../../img/hint_icon.png"/>
                    <p class="c_g pt20 pb30 f24">你的账户，空空如也</p>
                    <a :href="activityHref" class="c_c f12">快去参加活动吧</a>
                </div><!--空白显示页...end-->

                <div class="red-packet" v-show="activeTab.list.length != 0">
                    <ul class="red-list">
                        <mt-loadmore :top-method="loadTopK" :bottom-method="loadBottomK"
                                     :bottom-all-loaded="tabs[1].allLoaded" ref="loadmoreK">
                            <li v-for="(data, ind) in activeTab.list"
                                :class="tabs[1].htmlConfig[data.state].liClass">
                                <em class="redNum f60">{{Util.getPureNum(data.prize.name)}}</em>
                                <i class="per">{{Util.getLastSymbol(data.prize.name)}}</i>
                                <cite class="green-hands f14 pt10">{{data.activityName}}<!-- state => {{data.state}}--></cite>
                                <cite class="validity f12 cc60">收益加倍至：{{formatDate(data.actEdate)}}</cite>
                                <!--<cite class="validity0 f12 cc60">有效期至：{{formatDate(data.prize.edate)}}</cite>-->
                                <p>
                                    <cite :class="tabs[1].htmlConfig[data.state].useBtnClass" @click="usenow(data)">{{tabs[1].htmlConfig[data.state].useBtnText}}</cite>
                                    <span class="mui-pull-left f12 ccb6 mb5" v-html="Util.convertSymbol(data.prize.des)"><!--{{Util.convertSymbol(data.prize.des)}}<br/>&nbsp;--><!--{{"奖励最高金额288元<br>不可叠加使用"}}--></span>
                                </p>
                            </li>

                            <div slot="top" class="mint-loadmore-top">
                                <span v-show="true"></span>
                            </div>

                            <div slot="bottom" class="mint-loadmore-bottom">
                                <span v-show="true"></span>
                            </div>
                        </mt-loadmore>
                    </ul>
                </div>
            </div><!--卡卷列表...end-->
        </div><!--中间内容部分...end-->

        <div class="p_bg" v-show="mobileLoginVisible"><!--模态框--></div><!--模态框...end-->

        <div class="has_draw phone_draw" v-show="mobileLoginVisible"><!--手机登录弹窗-->
            <cite class="h_close" @click="mobileLoginVisible=false"></cite>
            <p class="f20 c_fff mui-text-center mt40 mb20">登录超时，请登录</p>
            <ul class="login-box pl10 pr10">
                <li class="hp44 lh44 bb txt_inp_new">
                    <input class="lh24 w100 bd f14" type="text" placeholder="请输入手机号"
                           v-model="mobile">
                    <span class="close" @click="mobile=''">&nbsp;</span>
                </li>
                <li class="hp44 lh44 bb txt_inp_new">
                    <input class="lh24 w50 bd f14" type="text" placeholder="请输入短信验证码"
                           v-model="mobileCode">
                    <span class="f14 fr mr20 send pl15 hp26 lh26 mt10 cc3" :class="{'sms_disabled': !sendState}"
                          :disabled="!sendState" @click="sendCode">{{sendText}}</span>
                    <span class="close" @click="mobileCode=''">&nbsp;</span>
                </li>
            </ul>
            <button type="button" class="bd f16 w40 c_fff btn_bg bor_radius16 mr ml"
                    @click="appLogin(initData)"
                    :disabled="mobile.length<11 || mobileCode.length<2">确认
            </button>
        </div><!--手机登录弹窗...end-->

        <div><!--trade登录弹窗-->
            <mt-popup
                    v-model="loginVisible"
                    position="right"
                    :modal="false"
                    style="width: 100%;height: 100%;">

                <div class="login_content">
                    <ul class="login-box white_bg mt44 pl20 pr20">
                        <li class="hp44 lh44 bb" @click="typeVisible=true">
                            <span class="f14 cc9 fl">证件类型</span>
                            <div class="deduct-box fr mui-text-center">
                                <span id="result" class="f14 cc3 select-btn">{{params.name}}</span>
                                <i class="dropDdown ml6"></i>
                            </div>
                        </li>
                        <li class="hp44 lh44 bb txt_inp_new">
                            <input class="lh24 w100 bd f14" type="text" placeholder="请输入身份证号/基金账号"
                                   v-model="params.lognumber">
                            <!--<span class="close" @click="params.lognumber=''">&nbsp;</span>-->
                        </li>
                        <li class="hp44 lh44 bb txt_inp_new">
                            <input class="lh24 w100 bd f14" type="password" placeholder="请输入密码"
                                   v-model="params.password">
                            <!--<span class="close" @click="params.password=''">&nbsp;</span>-->
                        </li>
                    </ul>
                    <!--<p class="forget f14 pl20 pb20 mui-text-right pr20 mt10" @click="loginVisible=false">&lt;返回</p>-->
                    <div class="agreement lh24 pl20 f12 mt10 mb10">
                        <cite :class="{'mr10 active': agreeFlag, 'mr10': !agreeFlag}"
                              @click="agreeFlag=!agreeFlag"></cite>
                        <ins>我已阅读并同意</ins>
                        <a href="https://m.cifm.com/mweb/xieyi/201512/t20151224_72442.html?randid=0.2628799173046854"
                           class="c_x">《上投摩根基金微信快捷服务协议》</a></div>

                    <button type="button" class="mui-btn btn_bg mui-btn-block mt20 w50 mb20 c_fff bd mr ml bor_radius40"
                            @click="loginUse(usenow)">登录使用
                    </button>
                    <p class="register_now mt54 mui-text-center">
                        <ins>卡券账户仅能绑定一个身份证号或基金账号</ins>
                    </p>
                    <p class="register_now mt10 mui-text-center">
                        <ins>还没基金账号?</ins>
                        <a href="https://m.cifm.com/weixin-fund/pages/account-openAcco-tl-validate.html?roleKey=1">去注册>></a>
                    </p>
                </div>

                <!--v-model="typeVisible"-->
                <mt-popup
                        v-model="typeVisible"
                        position="bottom"
                        style="width: 100%;">
                    <div>
                        <button type="button" @click="typeVisible = false"
                                class="ml20 mt20 mui-btn mui-btn-primary mui-btn-outlined">取消
                        </button>
                        <button type="button" @click="selectIdType()" class="mt20 mr20 fr">确定</button>
                    </div>
                    <mt-picker :slots="idTypes" valueKey="name" @change="onSelectIdType"></mt-picker>
                </mt-popup>
            </mt-popup>

        </div><!--trade登录弹窗...end-->
    </div>

</template>

<script>

    import Vue from 'vue';
    import router from '../../js/config/RedRouterConfig'
    import {Util} from '../../js/utils/CommonUtil'
    import {Base64} from 'js-base64'
    import '../../css/mui.min.css'

    import {
        Loadmore,
        Navbar,
        TabItem,
        TabContainer,
        TabContainerItem,
        Cell,
        Toast,
        Indicator,
        Picker,
        Popup,
        MessageBox
    } from 'mint-ui';

    Vue.component(Navbar.name, Navbar);
    Vue.component(TabItem.name, TabItem);
    Vue.component(TabContainer.name, TabContainer);
    Vue.component(TabContainerItem.name, TabContainerItem);
    Vue.component(Cell.name, Cell);
    Vue.component(Loadmore.name, Loadmore);
    Vue.component(Picker.name, Picker);
    Vue.component(Popup.name, Popup);

    export default {
        name: "coupons",
        data(){
            return {
                activityId: process.env.ACTIVITY_ID, /*活动id*/
                activityHref: process.env.ACTIVITY_HREF, /*活动id*/

                Util: Util,

//            {1:"未使用",2:"已使用",3:"使用中",4:"已过期"}卡券没有2
                tabs: [{
                    initState: false,
                    allLoaded: true,
                    type: "money",
                    title: '红包列表',
                    cacheList: [],
                    list: [],
                    htmlConfig: {
                        "1": {
                            name: "未使用",
                            liClass: "",
                            useBtnText: "立即使用",
                            useBtnClass: "use f12"
                        },
                        "2": {
                            name: "已使用",
                            liClass: "",
                            useBtnText: "已使用",
                            useBtnClass: "use f12 useing"
                        },
                        "3": {
                            name: "使用中",
                            liClass: "past",
                            useBtnText: "使用中",
                            useBtnClass: "use f12 useing"
                        },
                        "4": {
                            name: "已过期",
                            liClass: "past",
                            useBtnText: "已过期",
                            useBtnClass: "use f12 useing"
                        }
                    }
                }, {
                    initState: false,
                    allLoaded: true,
                    type: "ticket",
                    title: '我的卡券',
                    cacheList: [],
                    list: [],
                    htmlConfig: {
                        "1": {
                            name: "未使用",
                            liClass: "rate-coupon",
                            useBtnText: "立即使用",
                            useBtnClass: "use f12"
                        },
                        "2": {
                            name: "已使用",
                            liClass: "past-coupons",
                            useBtnText: "已使用",
                            useBtnClass: "use f12 useing no-border"
                        },
                        "3": {
                            name: "使用中",
                            liClass: "double-coupons",
                            useBtnText: "已使用",/*使用中*/
                            useBtnClass: "use f12 useing no-border"
                        },
                        "4": {
                            name: "已过期",
                            liClass: "past-coupons",
                            useBtnText: "已过期",
                            useBtnClass: "use f12 useing no-border"
                        }
                    }
                }],
                activeTab: {},
                initStateH: false,
                initStateK: false,
                limit: 10, /*初始化加载数量*/
                mobile: "",
                screenHeight: screen.availHeight,
                agreeFlag: true,
                loginState: false,
                loginVisible: false,
                idTypes: [
                    {
                        defaultIndex: 0,
                        values: [{
                            certificatetype: "0",
                            name: "身份证"
                        }, {
                            certificatetype: "0F",
                            name: "基金账号"
                        }, {
                            certificatetype: "2",
                            name: "军官证"
                        }, {
                            certificatetype: "3",
                            name: "士兵证"
                        }, {
                            certificatetype: "4",
                            name: "港澳通行证"
                        }, {
                            certificatetype: "8",
                            name: "文职证"
                        }, {
                            certificatetype: "9",
                            name: "警官证"
                        }, {
                            certificatetype: "A",
                            name: "台胞证"
                        }]
                    }
                ],
                idType: [],
                typeVisible: false,
                params: {
                    certificatetype: "",
                    name: "请选择",
                    lognumber: "",
                    password: "",
                    bindwx: "1",
                    authcode: "",
                    channel: "weixin",
                    timestamp: new Date().getTime()
                },


                sendState: true, /*验证码可以发送？*/
                sendText: '获取验证码', /*验证码文字显示*/
                lessSecond: 60, /*倒计时次数*/
                timeGap: 1000, /*间隔时间（毫秒）*/
                mobileCode: "", /*验证码*/
                mobileLoginVisible: false,

                dataRecrod: null
            };
        },
        created: function () {
            this.mobile = this.$route.params.mobile;
            if (!this.mobile && localStorage.getItem("mobile")) {
                try {
                    this.mobile = localStorage.getItem("mobile");
                } catch (e) {
                }
            }
            try {
                if (!this.params.lognumber) {
                    this.params.lognumber = localStorage.getItem("idNo");
                    this.params.password = localStorage.getItem("password");
                }
            } catch (e) {
            }

            this.idType = [this.idTypes[0].values[0]];
            this.selectIdType();
            this.activeTab = this.tabs[1];
            this.initData(this.checkLogin);


//            debugger
        },
        methods: {
            sendCode () {
                let msg = this.mobile == '' ? "请先输入手机号码！" : !/^1\d{10}$/.test(this.mobile) ? "电话号码有误,请输入11位手机号！" : "";
                if (msg.length > 0) {
                    Toast(msg);
                    return false;
                } else {
                    if (this.sendState) {
                        this.sendState = false
                        this.$http.jsonp("/web/sys/user/getCode", {params: {mobile: this.mobile}}).then(function (res) {
                            let data = res.data;
                            Toast(data.success ? "发送成功" : "发送失败，请再试一次");
                        });
                        this.reverseTime(this.lessSecond);
                    }
                }
            },
            getNum(str) {
                return str.match(/^\d+/)[0];
            },
            getUnNum(str) {
                return str.match(/[^\d]+/)[0];
            },
            initData() {/*数据初始化*/
                for (let i = 0; i < this.tabs.length; i++) {
                    let callback = function (res) {
                        let data = res.data, items = data.items;
                        if (data.success) {
                            items.sort(function (a, b) {/*先按state状态排序，在按照时间排序*/
                                if (a.state == b.state) {
                                    return a.edate > b.edate;
                                } else {
                                    return a.state > b.state;
                                }
                            });
                            this.tabs[i].cacheList = items;
                        }

                        /*debugger*/
                        /*if (i == 1) {
                         this.tabs[1].cacheList[0].state = '1';
                         this.tabs[1].cacheList[1].state = '2';
                         this.tabs[1].cacheList[2].state = '3';
                         this.tabs[1].cacheList[3].state = '4';
                         }*/
                        /*debugger*/

                        if (this.tabs[i].cacheList.length <= this.limit) {
                            this.tabs[i].allLoaded = true;
                        }
                        this.tabs[i].list = this.tabs[i].cacheList.slice(0, this.limit);
                    }.bind(this);
                    this.$http.jsonp("/app/act/prize/queryPrizeLogin", {
                        params: {
                            type: this.tabs[i].type
                        }
                    }).then(callback);
                }
                let arg = arguments;
                Util.recursion(arg);
            },
            sub(data, n) {/*判断是翻倍券还是加息券,返回true OR false*/
                let prizeType = data.prizeType, temp = (n == 4) ? "dou_" : "plus_";
                if (!prizeType) return '';
                return prizeType.substr(0, n) == temp;
            },
            toggle(ind) {/*tab切换*/
                this.activeTab = this.tabs[ind];
            },
            formatDate(date) {/*日期格式化eg:20101010->2010-10-10*/
                return date.substr(0, 4) + "-" + date.substr(4, 2) + "-" + date.substr(6, 2);
            },
            toPercent(data) {/*将小数转化为百分数*/
                let d = data.prize.money;
                return (Math.round(d * 10000) / 100);
            },
            loadTopH() {/*下拉刷新*/
                Indicator.open({
                    text: '加载中...'
                });
                setTimeout(function () {
                    Indicator.close();
                    this.initData();
                    this.$refs.loadmoreH.onTopLoaded();
                }.bind(this), 500);
            },
            loadTopK() {/*下拉刷新*/
                Indicator.open({
                    text: '加载中...'
                });
                setTimeout(function () {
                    Indicator.close();
                    this.initData();
                    this.$refs.loadmoreK.onTopLoaded();
                }.bind(this), 500);
            },
            loadBottomH() {/*上拉刷新*/
                let tab = this.tabs[0];
                this.loadBottom(tab, 'loadmoreH');
            },
            loadBottomK() {/*上拉刷新*/
                let tab = this.tabs[1];
                this.loadBottom(tab, 'loadmoreK');
            },
            loadBottom(tab, key) {
                tab.allLoaded = true;
                /*先控制下拉不能刷*/
                if (this.mobile && tab.initState) {
                    Indicator.open({
                        text: '加载中...'
                    });
                    setTimeout(function () {
                        Indicator.close();
                        this.limit += 2;
                        tab.list = tab.cacheList.slice(0, this.limit);
                        setTimeout(function () {
                            if (tab.list.length < tab.cacheList.length) {
                                tab.allLoaded = false;
                                this.$refs[key].onBottomLoaded();
                            } else {
                                if (tab.list.length == tab.cacheList.length) {
                                    tab.allLoaded = true;
                                    Toast("数据加载完毕");
                                }

                            }
                        }.bind(this), 100);
                    }.bind(this), 300);

                } else {
                    tab.initState = true;
                    tab.allLoaded = false;
                    this.$refs[key].onBottomLoaded();
                }
            },
            selectIdType(){/*选择证件类型*/
                this.typeVisible = false;
                this.params.certificatetype = this.idType[0].certificatetype;
                this.params.name = this.idType[0].name;
            },
            onSelectIdType(){/*证件类型选择列表滚动时回调函数*/
                this.idType = arguments[1];
            },
            usenow(data) {
                if (data) this.dataRecrod = data;
                else {
                    data = this.dataRecrod;
                    this.dataRecrod = null;
                    console.info("data => " + data);
                }
                if (data.state == '1') {
//                    Toast("立马使用");
                    if (this.loginState) {
                        if (!this.params.lognumber || !this.params.password) {
                            this.loginVisible = true;
                            return false;
                        }
                        this.$http.jsonp("/web/act/login/loginUse", {
                                params: {
                                    mobile: this.mobile,
                                    idType: this.params.certificatetype,
                                    username: this.params.lognumber,
                                    password: Base64.encode(this.params.password),
                                    num: data.num,
                                    activityId: this.activityId
                                }
                            }
                        ).then(function (res) {
                            let data = res.data;
                            if (data.success) {
                                data.state = "3";
                                this.initData();
                                window.location.href = "https://m.cifm.com/weixin-fund/pages/trade-money-in.html?fundcode=000857";
                            } else {
                                this.initData();
                                Toast("使用失败，请联系管理员");
                                console.info(data);
                            }
                        }.bind(this))
                    } else {
                        this.loginVisible = true;

                    }
                } else {
//                    Toast(data.state);
                }
            },
            checkLogin(){/*检查trade登录状态*/
                let arg = arguments;
                if (this.mobile) {
                    this.$http.jsonp("/web/act/login/checkLogin", {params: {mobile: this.mobile}}).then(function (res) {
                        if (!res.data.success) {
                            this.mobileLoginVisible = true;
                        } else {/*已经登录*/
                            /*this.$http.jsonp('/web/trade/checkLogin', {params: {}}).then(function (res) {
                             let data = res.data;
                             if (data.success) {*/
                            this.$http.jsonp('https://m.cifm.com/appServer/account/loginbytoken/checksession.json', {
                                params: {},
                                jsonp: "jsonpCallback"
                            }).then(function (res) {
                                let data = res.data;
                                if (data.successful) {
//                                    this.loginState = true;
                                    Util.recursion(arg);
                                } else {
                                    this.loginState = false;
                                }
                            }.bind(this));
                            /*} else {
                             this.loginState = false;
                             }
                             }.bind(this));*/
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
                    this.mobileLoginVisible = !data.success;
                    this.loginState = false;
                    if (data.success) {
                        try {
                            localStorage.setItem("mobile", this.mobile);
                        } catch (e) {
                        }
//                        this.loginVisible = true;
                        Util.recursion(arg);
                    } else if (data.code == "CIFM_9998") {
                        Toast("验证码错误");
                    } else {
                        Toast("登录失败，请重新发送验证码");
                    }
                }.bind(this));
            },
            loginUse(){/*基金账号登录*/
                if (!this.params.certificatetype) {
                    MessageBox('', '请选择证件类型');
                    return false;
                }
                if (!this.params.lognumber) {
                    MessageBox('', '请输入证件号码');
                    return false;
                }
                if (!this.params.password) {
                    MessageBox('', '请输入密码');
                    return false;
                }
                if (!this.agreeFlag) {
                    MessageBox('', '请先阅读《上投摩根基金微信快捷服务协议》');
                    return false;
                }
                let arg = arguments;
                /*this.$http.jsonp("/web/trade/login", {
                 params: {
                 username: this.params.lognumber,
                 password: this.params.password,
                 idType: this.params.certificatetype
                 }
                 },
                 ).then(function (res) {
                 let data = res.data;
                 if (data.success) {*/
                this.$http.jsonp("https://m.cifm.com/appServer/account/login/login.json", {
                        params: this.params,
                        jsonp: "jsonpCallback"
                    }
                ).then(function (res) {
                    let data = res.data;
                    if (data.successful) {
                        this.loginVisible = false;
                        this.loginState = true;
                        try {
                            localStorage.setItem("idNo", this.params.lognumber);
                            localStorage.setItem("password", this.params.password);
                        } catch (e) {
                        }
                        Util.recursion(arg);
//                        window.location.href = "https://m.cifm.com/weixin-fund/pages/trade-money-in.html?fundcode=000857";
                    } else {
                        MessageBox('', data.message)
                    }
                }.bind(this));
                /*} else {
                 MessageBox('', data.message);
                 }
                 }.bind(this));*/
            }
        }
    }

</script>

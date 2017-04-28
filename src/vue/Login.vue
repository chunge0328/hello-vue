<style>
</style>

<template>
    <div>
        <header id="header" class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-pull-left"></a>
            <h1 class="mui-title">登录</h1>
        </header>
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
                    <cite class="login_name"></cite>
                    <input class="lh24 w100 bd f14 ml35" type="text" placeholder="请输入证件号/基金账号"
                           v-model="params.lognumber">
                    <span class="close">&nbsp;</span>
                </li>
                <li class="hp44 lh44 bb txt_inp_new">
                    <cite class="password"></cite>
                    <input class="lh24 w100 bd f14 ml35" type="password" placeholder="请输入密码" v-model="params.password">
                    <span class="close">&nbsp;</span>
                </li>
            </ul>

            <div class="agreement lh24 pl20 f12 mt10 mb10"><cite class="mr10 active"></cite>
                <ins>我已阅读并同意</ins>
                <a href="javascript:void(0)" class="c_x">《上投摩根基金微信快捷服务协议》</a></div>
                <p>卡券账户仅能绑定一条身份信息</p>
            <button type="button" class="mui-btn btn_bg mui-btn-block mt20 ml20 mr20 w90 mb20 c_fff bd"
                    @click="login()">立即登录
            </button>

            <!--<p class="forget f14 ccf pl20 pb20">忘记密码</p>-->
            <p class="register_now mt54 mui-text-center">
                <ins>还没有账号</ins>
                <a href="https://m.cifm.com/weixin-fund/pages/account-openAcco-tl-validate.html?roleKey=1">去注册>></a></p>
        </div>
        <!--<mt-actionsheet
                :actions="typeList"
                v-model="typeVisible">
        </mt-actionsheet>-->
        <mt-popup
                v-model="typeVisible"
                position="bottom">
            <div>
                <button type="button" @click="cancel()">取消</button>
                <button type="button" @click="ensure()">确定</button>
            </div>
            <mt-picker :slots="slots" valueKey="name" @change="onValuesChange"></mt-picker>
        </mt-popup>
    </div>
</template>

<script>

    import Vue from 'vue'
    import {Toast, MessageBox, Actionsheet, Picker, Popup} from 'mint-ui'
    import Turntable from '../js/utils/turntable'
    import {Button} from 'mint-ui'
    import {Field} from 'mint-ui';
    import {Indicator} from 'mint-ui';

    Vue.component(Picker.name, Picker);
    Vue.component(Popup.name, Popup);

    import router from '../js/config/RedRouterConfig'
    Vue.component(Button.name, Button);
    Vue.component(Field.name, Field);
    Vue.component(Actionsheet.name, Actionsheet);

    var activityId = '0f26f30d-ebc5-4de4-9590-4d6a50073108';
    export default {
        data () {
            return {
                slots: [
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
                            name: "台胞证"
                        }]
                    }
                ],
                slot:{},
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
                }
            }
        },
        methods: {
            cancel() {
                this.typeVisible=false;
            },
            ensure(){
                this.typeVisible=false;
                this.params.certificatetype = this.slot[0].certificatetype;
                this.params.name = this.slot[0].name;
            },
            onValuesChange(){
                this.slot = arguments[1];
            },
            login(){
                if (!this.params.certificatetype) {
                    Toast("请选择证件类型");
                    return false;
                }
                if (!this.params.lognumber) {
                    Toast("请输入证件号码");
                    return false;
                }
                if (!this.params.password) {
                    Toast("请输入密码");
                    return false;
                }
                this.$http.jsonp("https://m.cifm.com/appServer/account/login/login.json", {
                        params: this.params,
                        jsonp: "jsonpCallback"
                    },
                ).then(function (res) {
                    var data = res.data;
                    Toast(data.message);
                    if (data.successful) {
                        this.$http.jsonp("/web/trade/login", {
                                params: {
                                    username: this.params.lognumber,
                                    password: this.params.password,
                                    idType: this.params.certificatetype
                                }
                            },
                        ).then(function (res) {
                            console.info(res.data);
                        });
                        window.location.href = "https://m.cifm.com/weixin-fund/pages/trade-money-in.html?fundcode=000857";
                    }
                });
            }

        },
        created() {
            if (this.$route.params.mobile) {
                this.input = this.$route.params.mobile;
            }
        }
    }
</script>

<style>
</style>

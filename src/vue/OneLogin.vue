<style>
    .bg-col-red{
        background-color: red;
    }
    .bg-col-blue{
        background-color: blue;
    }
    .ht-500{
        height: 500px;
    }
</style>

<template>
    <div>


        <div class="bg-col-blue ht-500">


        </div>

        <div class="has_draw phone_draw">
            <cite class="h_close"></cite>
            <p class="f20 c_fff mui-text-center mt40 mb20">填手机 抽奖券</p>
            <ul class="login-box pl10 pr10">
                <li class="hp44 lh44 bb txt_inp_new">
                    <input class="lh24 w100 bd f14" type="text" placeholder="请输入手机号">
                    <span class="close">&nbsp;</span>
                </li>
                <li class="hp44 lh44 bb txt_inp_new">
                    <input class="lh24 w50 bd f14" type="text" placeholder="请输入短信验证码">
                    <span class="f14 fr mr20 send pl15 hp26 lh26 mt10 cc3">发送验证码</span>
                    <span class="close">&nbsp;</span>
                </li>
            </ul>
            <button type="button" class="bd f16 w40 c_fff btn_bg bor_radius16 mr ml">确认</button>
        </div>
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

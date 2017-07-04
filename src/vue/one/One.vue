<style>
    .sms_disabled {
        color: #bdbdbd;
    }
</style>
<template>
    <div class="bg-white">
        <el-row>
            <el-col :span="12">&nbsp</el-col>
            <el-col :span="6">
                <header id="header" class="mui-bar mui-bar-nav">
                    <a class="mui-action-back mui-pull-left"></a>
                    <h1 class="mui-title">登录</h1>
                </header>
            </el-col>
        </el-row>

        <div style="margin: 20px;"></div>
        <el-row>
            <el-col :span="6">&nbsp</el-col>
            <el-col :span="12">
                <el-form :label-position="labelPosition" label-width="80px" ref="loginForm" :model="loginForm">
                    <el-row>
                        <el-form-item label="手机：" prop="mobile" required>
                            <el-input type="text" v-model="loginForm.mobile"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="验证码：" prop="mobileCode" required>
                            <el-col :span="15">
                                <el-input type="text" v-model="loginForm.mobileCode" auto-complete="off"></el-input>
                            </el-col>
                            &nbsp;
                            <el-button :class="{'sms_disabled': !sendState}"
                                       :disabled="!sendState" @click="sendCode">{{sendText}}
                            </el-button>
                        </el-form-item>
                    </el-row>
                    <el-form-item>
                        <el-button type="primary" @click="appLogin()">提交</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    require("element-ui/lib/theme-default/index.css");
    import Vue from "vue";
    import {Util} from '../../js/utils/ValidateUtils';
    import router from '../../js/config/OneRouterConfig';
    import {Form, FormItem, Input, Button, Message, Row, Col} from "element-ui";
    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(Input);
    Vue.use(Button);
    Vue.use(Row);
    Vue.use(Col);

    export default {
        data(){
            return {
                Util: Util,
                labelPosition: 'left',
                sendState: true, /*验证码可以发送？*/
                sendText: '获取验证码', /*验证码文字显示*/
                lessSecond: 60, /*倒计时次数*/
                timeGap: 1000, /*间隔时间（毫秒）*/
                loginState: false, /*已经登录？*/
                loginForm: {
                    mobile: '',
                    mobileCode: "" /*验证码*/
                }
            };
        },
        methods: {
            validateCheck(){
                let mobile = this.loginForm.mobile;
                if (!Util.isEmpty(mobile)) {
                    Message({showClose: true, message: "请输入手机号码", type: 'warning'});
                    return false;
                } else if (!Util.checkMobile(mobile)) {
                    Message({showClose: true, message: "手机号码有误,请输入11位手机号!", type: 'warning'});
                    return false;
                } else {
                    return true;
                }
            },
            /*发送验证码 => start*/
            sendCode () {
                if (this.validateCheck()) {//验证输入是否正确
                    if (this.sendState) {
                        this.sendState = false;
                        this.$http.jsonp("/web/sys/user/getCode", {params: {mobile: this.loginForm.mobile}}).then(function (res) {
                            let data = res.data;
                            Message({
                                showClose: true,
                                message: data.success ? "发送成功" : "发送失败，请再试一次",
                                type: data.success ? "success" : "error"
                            });
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
            appLogin(){/*手机登录*/
                this.$http.jsonp("/web/act/login/login", {
                    params: {
                        mobile: this.loginForm.mobile,
                        code: this.loginForm.mobileCode
                    }
                }).then(function (res) {
                    let data = res.data;
                    this.loginState = data.success;
                    if (this.loginState) {
                        try {
                            localStorage.setItem("mobile", this.loginForm.mobile);
                            localStorage.setItem("code", this.loginForm.mobileCode);
                            router.push('/oneIndex/' + this.loginForm.mobile + '/' + this.loginForm.mobileCode);
                        } catch (e) {
                        }
                    } else if (data.code == "CIFM_9998") {
                        Message({showClose: true, message: "验证码错误", type: "error"});
                    } else {
                        Message({showClose: true, message: "登录失败，请重新发送验证码", type: "error"});
                    }
                }.bind(this));
            }
        }
    }
</script>

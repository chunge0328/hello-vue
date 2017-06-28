<style>
    .icon-user input {
        background: url("../img/user.png") no-repeat;
        padding: 2px 0 2px 36px;
        background-size: 28px auto;
        background-position: 0 center;
    }

    .icon-mobile input {
        background: url("../img/mobile.png") no-repeat;
        padding: 2px 0 2px 36px;
        background-size: 28px auto;
        background-position: 0 center;
    }

    .text-center {
        text-align: center;
    }

    .bg-white {
        background: white;
    }

    .transition-box {
        transition: all 0.6s;
        display: block;
        text-align: center;
        position: fixed;
        top: 0;
        left: 0;
        background-color: #fff;
        width: 100%;
        height: 100%;
    }

    .transition-box img {
        display: block;
        margin: 0 auto;
        width: 100%;
        max-width: 400px;
    }

    .transition-box p {
        display: block;
        color: #fb7a52;
        font-size: 24px;
        font-weight: 900;
    }

    .hide {
        transition: all 0.6s;
        opacity: 0;
    }

    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }

    .mg-top-20 {
        margin-top: 20px;
    }

    @media screen and (max-width: 380px) { .transition-box p { font-size: 18px } }
</style>
<template>
    <div>
        <el-row>

            <el-col :xs="1" :sm="2" :md="3" :lg="4">
                <div class="grid-content"></div>
            </el-col>
            <el-col :xs="22" :sm="20" :md="18" :lg="16">
                <img src="../img/pudding.png" alt="" style="display: block;width: 90%;max-width: 400px;margin: 0 auto">
            </el-col>
            <el-col :xs="1" :sm="2" :md="3" :lg="4">
                <div class="grid-content bg-white"></div>
            </el-col>
        </el-row>


        <el-row :gutter="10" class="mg-top-20">
            <el-col :xs="1" :sm="2" :md="3" :lg="4">
                <div class="grid-content bg-white"></div>
            </el-col>
            <el-col :xs="22" :sm="20" :md="18" :lg="16">
                <div class="grid-content">

                    <el-input
                            placeholder="请输入姓名"
                            v-model="feedbackParam.name" class="icon-user">
                    </el-input>

                    <el-input
                            placeholder="请输入座机"
                            icon="el-icon-information"
                            v-model="feedbackParam.contact" class="mg-top-20 icon-mobile">
                    </el-input>

                    <el-input
                            type="textarea"
                            :rows="4"
                            placeholder="请输入建议"
                            v-model="feedbackParam.content" class="mg-top-20">
                    </el-input>
                </div>
            </el-col>
            <el-col :xs="1" :sm="2" :md="3" :lg="4">
                <div class="grid-content bg-white"></div>
            </el-col>
        </el-row>
        <el-row class="mg-top-20">
            <el-col :xs="1" :sm="2" :md="3" :lg="4">
                <div class="grid-content bg-white"></div>
            </el-col>
            <el-col :xs="22" :sm="20" :md="18" :lg="16">
                <div class="grid-content text-center">
                    <el-button type="danger" @click="submitFeedback" style="width: 100%;background-color: #fb7a52;">
                        填好了
                    </el-button>
                </div>
            </el-col>
            <el-col :xs="1" :sm="2" :md="3" :lg="4">
                <div class="grid-content bg-white"></div>
            </el-col>
        </el-row>
        <el-row :style="modalStyle">
            <div :class="{ 'transition-box': show, 'transition-box hide': !show}">
                <el-col :xs="1" :sm="2" :md="3" :lg="4">
                    <div class="grid-content bg-white"></div>
                </el-col>
                <el-col :xs="22" :sm="20" :md="18" :lg="16"class="mg-top-20">
                    <img src="../img/pudding2.png" alt="" >
                    <p class="mg-top-20">感谢您提的宝贵意见，么么哒！</p>
                    <el-button type="danger" @click="switchModal" style="width: 100%;background-color: #fb7a52;">关闭</el-button>
                </el-col>
                <el-col :xs="1" :sm="2" :md="3" :lg="4">
                    <div class="grid-content bg-white"></div>
                </el-col>
            </div>
        </el-row>


    </div>
</template>

<script>
    require("element-ui/lib/theme-default/index.css");

    import Vue from "vue";
    import {
        Row, Col, Input, Button, Message, Tooltip
    }
        from "element-ui";

    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Input);
    Vue.use(Button);
    Vue.use(Tooltip);

    export default {

        data(){
            return {
                modalStyle:{'z-index': -999},
                show: false,
                submiting:false,
                feedbackParam: {
                    name: "",
                    contact: "",
                    content: ""
                }
            }
        },
        methods: {
            switchModal(){
                this.show = !this.show;
                this.modalStyle['z-index'] = -1 * this.modalStyle['z-index'];
            },
            submitFeedback(){
                if (this.feedbackParam.name === "") {
                    Message({
                        message: "敢问大侠尊敬大名？"
                    });
                } else if (!/[-\d]+/.test(this.feedbackParam.contact)) {
                    Message({
                        message: "给个正确的联系方式吧？"
                    });
                } else if (this.feedbackParam.content === "") {
                    Message({
                        message: "Unbelievable!~难道我们的程序是完美的？"
                    });
                } else {
                    if(!this.submiting) {
                        this.submiting = true;
                        this.$http.jsonp("/web/sys/feedback/save", {params: this.feedbackParam}).then(function (res) {
                            this.submiting = false;
                            this.switchModal();
                            let data = res.data;
                            Message({
                                message: data.success ? "提交成功" : data.message
                            });
                        }.bind(this));
                    }
                }
            }
        }, created() {
        }
    }
</script>

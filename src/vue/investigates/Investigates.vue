<style>
</style>
<template>
    <div>
        <div>
            <el-dialog title="请输入信息" v-model="inputShow">
                <div class="el-input">
                    <input v-model="ivstLog.idNo" class="el-input__inner" placeholder="请输入身份证号/证券账号"
                           @keyup.enter="custExist"></input>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="custExist">确 定</el-button>
                </div>
            </el-dialog>
        </div>

        <el-row class="block" v-show="!readySubmit">
            <el-carousel :autoplay="false" @change="handleCheckAnswer" ref="carousel"
                         :arrow="answerComplete ? 'always': 'never'"
                         indicator-position="none" trigger="click" height="600px">
                <el-carousel-item v-for="(content, index) in contentList" :key="'content-' + index"
                                  :name="'content-' + index">
                    <h3>{{content.name}}</h3>
                    <ul>
                        <el-radio-group @change="handleAnswer" v-model="ivstLog.resultText[index][content.name]">
                            <li v-for="(child, chIndex) in content.childs" :key="'child-' + chIndex">
                                <el-radio class="radio"
                                          :label="child.name">{{serias[chIndex]}}、{{child.name}}
                                </el-radio>
                            </li>
                        </el-radio-group>
                    </ul>
                    <el-row v-show="answerComplete" style="margin-top: 60px;">
                        <el-col :span="24" style="text-align: center;">
                            <el-button type="success" @click="readySubmit = true">修改完成</el-button>
                        </el-col>
                    </el-row>
                </el-carousel-item>
            </el-carousel>
        </el-row>
        </el-row>

        <el-row v-show="answerComplete && readySubmit">
            <el-row>
                <el-button v-for="(result, index) in ivstLog.resultText" :type="getResultType(result, index)"
                           :key="'result-'+index" @click="switchToContent(result, index)">
                    <i :class="getResultClass(result, index)"></i>
                    {{index + 1}}
                    <span v-for="(val, key) in result">{{val}}</span>
                </el-button>
            </el-row>
            <el-row style="margin-top: 30px;">
                <el-col :span="6">
                    &nbsp;
                </el-col>
                <el-col :span="12" style="text-align: center;">
                    <el-button type="success" @click="submitAnswer">提交</el-button>
                    <el-button @click="readySubmit=false">修改</el-button>
                </el-col>
            </el-row>
        </el-row>
    </div>
</template>

<script>
    require("../../css/investigates.css");
    require("element-ui/lib/theme-default/index.css");

    import Vue from "vue";
    import {
        Message, Carousel, CarouselItem, Radio, RadioGroup, Button, Row, Col, Dialog, Input, MessageBox
    }
        from "element-ui";

    Vue.use(Carousel);
    Vue.use(CarouselItem);
    Vue.use(Radio);
    Vue.use(RadioGroup);
    Vue.use(Button);
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Dialog);
    Vue.use(Input);

    export default {

        data(){
            return {
                activityId: process.env.activityId,
                contentList: [],

                serias: ["A", "B", "C", "D"],

                ivstLog: {
                    fundCode: "空",
                    idType: "身份证",
                    idNo: "",
                    resultType: "json",
                    resultText: []
                },

                answerComplete: false,
                readySubmit: false,

                inputCorrect: false,
                inputShow: true,

            }
        },
        methods: {
            getResultType(result, index){
                for (let i in result) {
                    return !result[i] ? "danger" : "success";
                }
            },
            getResultClass(result, index){
                for (let i in result) {
                    return !result[i] ? "el-icon-circle-cross " : "el-icon-circle-check";
                }
            },
            switchToContent(result, index){
                this.readySubmit = false;
                this.$refs.carousel.setActiveItem(index);
            },
            handleCheckAnswer(curr, prev){
                let resultLen = this.ivstLog.resultText.length;
                if (prev === 0 && curr === resultLen - 1) {
                    this.$refs.carousel.setActiveItem(0)
                } else if (prev === resultLen - 1 && curr === 0) {
                    this.answerComplete = this.readySubmit = true;
                }
            },
            handleAnswer(){
                if (!this.answerComplete) {
                    this.$refs.carousel.next();
                }
            },
            listContent() {
                this.$http.post("/web/ivst/content/list", {
                        activityId: this.activityId,
                        sort: JSON.stringify([{
                            pro: "parentId",
                            dir: "asc"
                        }, {pro: "seq", dir: "asc"}])
                    }, {
                        headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},
                        emulateJSON: true,
                    }
                ).then(function (data) {
                    let items = data.data.items, parent = {}, cou = 0;
                    this.contentList = [];
                    this.ivstLog.resultText = [];
                    for (let i = 0; i < items.length; i++) {
                        let item = items[i];
                        if (item.seq == '#') {
                            parent = item;
                            let obj = {};
                            obj[parent.name] = "";
                            this.ivstLog.resultText.push(obj);
                            parent.childs = [];
                            this.contentList.push(parent);
                        } else {
                            parent.childs.push(item);
                        }
                    }
                }.bind(this));
            },
            custExist(){
                this.$http.post("/web/ivst/findCust", {input: this.ivstLog.idNo}, {
                    headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},
                    emulateJSON: true,
                }).then(function (res) {
                    let data = res.data;
                    if (data && !data.success) {
                        this.inputShow = true;
                        this.inputCorrect = false;
                        Message({
                            message: "不存在的身份证号/证券账号"
                        });
                    } else {
                        this.inputShow = false;
                        this.inputCorrect = true;
                        this.ivstLog.idNo = data.data.idNo;
                        if (this.answerComplete) {
                            MessageBox({
                                title: '消息',
                                message: "确认提交？",
                                showCancelButton: true,
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                beforeClose: function (action, instance, done) {
                                    if (action === 'confirm') {
                                        instance.confirmButtonLoading = true;
                                        instance.confirmButtonText = '提交中...';
                                        this.submitAnswer();
                                        instance.confirmButtonLoading = false;
                                        done();
                                    } else {
                                        done();
                                    }
                                }.bind(this)
                            }).then(action => {
                                /*Message({
                                 type: 'info',
                                 message: 'action: ' + action
                                 });*/
                            });
                        }
                    }
                }.bind(this));
            },
            submitAnswer(){
                if (!this.inputCorrect) {
                    this.inputShow = true;
                    Message({
                        message: "请输入身份证号/证券账号"
                    });
                    return;
                }
                this.ivstLog.activityId = this.activityId;
                let param = JSON.parse(JSON.stringify(this.ivstLog));
                param.resultText = JSON.stringify(param.resultText);
                this.$http.jsonp("/web/ivst/submit", {params: param}).then(function (res) {
                    let data = res.data;
                    Message({
                        message: data.success ? "提交成功" : data.message
                    });
                }.bind(this));
            }
        },
        created() {
            this.listContent();
        }
    }
</script>

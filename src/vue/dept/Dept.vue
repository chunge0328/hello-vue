<style>
    .question-list {
        padding-left: 0px;
    }

    .question-list .el-radio {
        display: block;
        padding-left: 50px;
        margin-top: 40px;
        margin-left: 0px !important;
    }

    .question-list label.el-radio {
    !important margin-left: 0 px;
    }

    #beginbtn {
        margin-left: 600px;
    }

    #nextbtn {
        margin-left: 600px;
    }

    .ckquestion-list {
        display: block;
        padding-left: 50px;
        margin-top: 30px;
        padding-right: 450px;
        margin-left: 0px !important;
    }

    #remark {
        margin-top: 20px;
        margin-left: 50px !important;
    }

    .multi-sel {
        display: block;
        margin-left: 0px !important;
        margin-top: 20px;
    }


</style>
<template>
    <div class="bg-white bgwidth">
        <el-row v-show="!completeAnswer || modifyAnswer">
            <el-col :span="12">&nbsp;</el-col>
            <el-col :span="6">
                <header id="header" class="mui-bar mui-bar-nav">
                    <a class="mui-action-back mui-pull-left"></a>
                    <h1 class="mui-title">问卷调查</h1>
                </header>
            </el-col>
        </el-row>

        <el-row>
            <el-progress v-if="questions && questions.length > 0" :text-inside="true" :stroke-width="18" :percentage="Math.floor(activeIndex * 100 / questions.length)"></el-progress>
        </el-row>

        <el-form>
            <el-row v-if="seen">
                <h3>请先填写以下信息：</h3><br>
                <el-form-item
                        label="基金账户名称"
                >
                    <el-input v-model="fundAccoName" placeholder="基金账户名称(必输)"></el-input>
                </el-form-item>
                <el-form-item
                        label="证件类型">
                    <el-input v-model="idType" placeholder="证件类型（必输）"></el-input>
                </el-form-item>

                <el-form-item
                        label="证件编号">
                    <el-input v-model="idNo" placeholder="证件编号（必输）"></el-input>
                </el-form-item>

                <el-button id="beginbtn" type="primary" @click="beginTest">开始测评</el-button>
            </el-row>
        </el-form>


        <!--单选题-->
        <el-row v-for="(que, ind) in questions" :key="ind"
                v-show="activeIndex == ind && (!completeAnswer || modifyAnswer)">
            <h3>{{ind+1+checkList.length}}、{{que.name}}</h3>
            <el-radio-group v-if="answers[ind] && que.type =='单选'" v-model="answers[ind].answerId" class="question-list"
                            @change="handleNext">
                <el-radio v-for="(ans, ind1) in que.answerListList" :label="ans.id" :key="ind+'-'+ind1">
                    {{seqs[ind1]}}、{{ans.name}}
                </el-radio>
            </el-radio-group>


            <!--多选-->
            <el-checkbox-group v-model="answers[ind].answerId" v-if="answers[ind] && que.type !='单选'"
                               class="ckquestion-list">
                <el-checkbox v-for="(ans,ind1) in que.answerListList" :label="ans.id" :key="ind+'-'+ind1"
                             class="multi-sel">
                    {{seqs[ind1]}}、{{ans.name}}
                </el-checkbox>
            </el-checkbox-group>

            <el-row id="remark">{{(que.remark == "" || que.remark == undefined )?"": ("（"+que.remark+"）")}}</el-row>

            <el-row style="text-align: center;">
                <el-button type="primary" @click="handlePrev" v-if="ind > 0">
                    上一题
                </el-button>
                <el-button type="primary" @click="handleNext(ind)" v-if="ind > 0 && que.type != '单选'">
                    下一题
                </el-button>
            </el-row>
            <el-row style="text-align: center;">
                <el-button v-if="completeAnswer" @click="modifyAnswer = false" type="primary" size="large">修改完成
                </el-button>
            </el-row>
        </el-row>


        <div class="bg-white bgwidth" id="test" v-show="completeAnswer && !modifyAnswer">
            <el-row :gutter="20" class="top10">
                <el-col :span="12">&nbsp;</el-col>
                <el-col :span="6">
                    <header class="mui-bar mui-bar-nav">
                        <a class="mui-action-back mui-pull-left"></a>
                        <h1 class="mui-title">问卷调查结果</h1>
                    </header>
                </el-col>
            </el-row>

            <el-row :gutter="20" class="top10">

            <pre style="font-size: 18px">
                下表是根据贵公司对上述问题回答的总分，借此评估贵公司在面对风险时所持有的“一般”态度。
                分数风险属性典型分类定义<br>
                <b> ▶ 18分  C1-保守型</b><br>
                代表贵公司可以接受以下情况：预期波动性极低。强烈关注资产的安全性，对风险高度厌恶。<br>
                <b> ▶ 19分-30分 C2-平衡型</b><br>
                代表贵公司可以接受以下情况：预期波动性低，但非绝对保证。资产市值虽然波动较低，但可能低于原始投资本金。<br>
                <b> ▶ 31分-42分 C3-稳健型</b><br>
                代表贵公司可以接受以下情况：较高的投资风险，希望预期报酬率可以优于中长期存款利率（3-5年）并确保投资本金不因通胀而贬值。资产市值会波动，而且可能低于原始投资本金。预期波动性高于“保守型”投资人。<br>
                <b> ▶ 43分-54分 C4-积极型</b><br>
                代表贵公司可以接受以下情况：高度的投资风险，其短、中及长期的波动性均高，但也希望获得较高回报。资产市值会波动，而且可能远低于原始投资本金。预期波动性高于“稳健型”投资人。<br>
                <b> ▶ 55分-62分 C5-进取型</b><br>
                代表贵公司可以接受以下情况：极高的风险偏好，希望得到远超大盘的投资回报。资产市值会波动，并且可能完全损失原始投资本金。预期波动性高于“积极型”投资人
                根据您所提供的答案，贵公司的总分是<b style="text-decoration: underline">（     {{score}}     ）</b>  。参照以上定义，贵公司面对投资风险的“一般”承受度大致是 <b
                    style="text-decoration: underline"> （    {{riskName}}       ）</b> 型。
            </pre>
            </el-row>
            <el-row style="text-align: center">
                <el-button @click="exportQue" type="default" size="large">导出Pdf</el-button>
            </el-row>

        </div>
    </div>
</template>

<script>
    require("element-ui/lib/theme-default/index.css");

    import Vue from "vue";
    import $ from '../../js/utils/Util';
    import router from '../../js/config/DeptRouterConfig';
    import {
        Message, Radio, RadioGroup, Button, Row, Col, Input, Form, FormItem, CheckboxGroup, Checkbox,Progress
    }
        from "element-ui";

    Vue.use(Radio);
    Vue.use(RadioGroup);
    Vue.use(Button);
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Input);
    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(CheckboxGroup);
    Vue.use(Checkbox);
    Vue.use(Progress);


    export default {

        data(){
            return {
                arr: [],
                topicId: process.env.TOPIC_ID,
                seqs: ["A", "B", "C", "D", "E", "F"],
                questions: [],
                answers: [],
                checkList: [],
                checkListAnswer: [],
                activeIndex: 0,
                completeAnswer: false,
                modifyAnswer: true,
                fundAccoName: '',
                idType: '',
                idNo: '',

                seen: 'true',
                seen1: 'true',
                show1: 'true',
                count: 0,
                score: 0,
                riskName: ''
            }
        },
        created() {
            this.init();
        },
        methods: {
            init(){/*判断是否登录*/
                this.$http.jsonp("/web/act/login/checkLogin", {
                    params: {
                        mobile: this.$route.params.mobile
                    }
                }).then(function (res) {
                    if (!res.data.success) {
                        Message({
                            showClose: true,
                            message: "请先登录",
                            type: "warning"
                        });
                    } else {
                        // this.handleListQuestion();
                    }
                }.bind(this));
            },
            beginTest(){
                if (this.fundAccoName.trim() == "" || this.idType.trim() == "" || this.idNo.trim() == "") {
                    Message("请先填写表单内容！");
                    return;
                }
                if (!/^[A-Za-z0-9]{6,18}$/.test(this.idNo.trim())) {
                    Message("请输入正确的证件号码！")
                    return;
                }

                this.seen = false;
                this.handleListQuestion();
            },
            exportQue(){
                var host = process.env.BASE_PATH;
                window.open(host + "/web/question/question/createPdf?topicId=" + this.topicId + "&idType=" + this.idType + "&fundAccoName=" + this.fundAccoName + "&idNo=" + this.idNo);
            },
            handleListQuestion() {
                this.$http.jsonp("/web/question/question/list", {
                    params: {
                        topicId: this.topicId,
                        sort: JSON.stringify([{"property": "cdate", "direction": "DESC"}, {
                            "property": "seq",
                            "direction": "asc"
                        }])
                    }
                }).then(function (data) {
                    let items = data.data.items;
                    this.handleInitAnswer(items);
                    this.questions = items;
                }.bind(this));
            },

            handleQuestion(questions){
                if (questions != null) {
                    let sque = this.questions;  //单选题
                    let ckque = this.checkList; //多选题
                    sque = [];
                    for (let i = 0; i < questions.length; i++) {
                        let que = questions[i];
                        if (que.type == "单选") {
                            this.questions.push(questions[i]);
                        } else if (que.type == "多选") {
                            this.checkList.push(questions[i]);
                        }
                    }
                }
            },
            handleInitAnswer(questions){
                if (questions != null) {
                    let ans = this.answers;
                    let cans = this.checkListAnswer;
                    ans = [];
                    cans = [];

                    for (let i = 0; i < questions.length; i++) {
                        let que = questions[i];
                        if (que.type == "单选") {
                            this.answers.push({
                                questionId: que.id,
                                answerId: ""
                            })
                        } else if (que.type != "单选") {
                            this.answers.push({
                                questionId: que.id,
                                answerId: [],
                            })
                        }

                    }
                }
            },
            handleNext(label){
                if (this.activeIndex < this.questions.length - 1) {
                    this.activeIndex += 1;
                } else {
                    this.completeAnswer = true;
                    this.modifyAnswer = false;
                    this.submitAnswer();
                }
            },
            handlePrev(label){
                if (this.activeIndex > 0) {
                    this.activeIndex -= 1;
                }
            },
            submitAnswer() {
                //处理答案列表
                var ans = JSON.parse(JSON.stringify(this.answers));
                var ansP = [];
                for (let i = 0; i < ans.length; i++) {
                    let an = ans[i];
                    let flag = $.type(an.answerId) == 'array';
                    if (!flag) {
                        ansP.push(an);
                    } else {
                        for (let j = 0; j < an.answerId.length; j++) {
                            ansP.push({
                                questionId: an.questionId,
                                answerId: an.answerId[j]
                            });
                        }
                    }
                }
                this.$http.jsonp("/web/question/question/evaluate2", {
                    params: {
                        answerList: JSON.stringify(ansP),
                        topicId: this.topicId,
                        fundAccoName: this.fundAccoName,
                        idType: this.idType,
                        idNo: this.idNo
                    }
                }).then(function (res) {
                    let data = res.data;
                    if (data.code == "CIFM_0105") {
                        Message({
                            message: data.message
                        });
                        return;
                    }
                    let items = data.items;
                    this.handleInitAnswer(items);
                    this.questions = items;
                    if (data.success) {
                        this.$http.jsonp("/web/question/queUser/getRiskInfo", {
                            params: {
                                fundAccoName: this.fundAccoName,
                                idType: this.idType,
                                idNo: this.idNo
                            }
                        }).then(function (res) {
                            let data = res.data.data;
                            this.score = data.score;
                            this.riskName =  data.riskName;
//                            router.push('/result/' + data.score + '/' + data.riskName);
//                            Message({
//                                showClose: true,
//                                message: "您的风险等级为" + data.riskName,
//                                type: "success"
//                            });
                            //this.seen1 = !this.seen1
                        }.bind(this));
                    }
                }.bind(this));
            },
            getResultType(result, index){
                for (let i in result) {
                    return (!result[i] || result[i].answerId) ? "danger" : "success";
                }
            },
            getResultClass(result, index){
                for (let i in result) {
                    return !result[i] ? "el-icon-circle-cross " : "el-icon-circle-check";
                }
            },
            switchToContent(result, index) {
                this.activeIndex = index;
                this.modifyAnswer = true;
            }
        }
    }
</script>

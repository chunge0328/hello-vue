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
        margin-left: 700px;
    }

</style>
<template>
    <div>

        <el-row>
            <el-col :span="12">&nbsp;</el-col>
            <el-col :span="6">
                <header id="header" class="mui-bar mui-bar-nav">
                    <a class="mui-action-back mui-pull-left"></a>
                    <h1 class="mui-title">问卷调查</h1>
                </header>
            </el-col>
        </el-row>

        <el-form>
            <el-row v-if = "seen">
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



        <el-row v-for="(que, ind) in questions" :key="ind"
                v-show="activeIndex == ind && (!completeAnswer || modifyAnswer)">
            <h3>{{ind+1}}、{{que.name}}</h3>
            <el-radio-group v-if="answers[ind]" v-model="answers[ind].answerId" class="question-list"
                            @change="handleNext">
                <el-radio v-for="(ans, ind1) in que.answerListList" :label="ans.id" :key="ind+'-'+ind1">
                    {{seqs[ind1]}}、{{ans.name}}
                </el-radio>
            </el-radio-group>
            <el-row style="text-align: center;">
                <el-button v-if="completeAnswer" @click="modifyAnswer = false" type="primary" size="large">修改完成
                </el-button>
            </el-row>
        </el-row>

        <el-row v-show="completeAnswer && !modifyAnswer">
            <el-row :gutter="80">
                <el-col v-for="(ans, ind) in answers" :key="'result-'+ind" :span="24/4" style="margin-top: 20px">
                    <el-button :type="getResultType(ans, ind)"
                               @click="switchToContent(ans, ind)">
                        <i :class="getResultClass(ans, ind)"></i>
                        {{ind + 1}}
                    </el-button>
                </el-col>
            </el-row>
            <el-row style="margin-top: 40px; text-align: center;">
                <el-button @click="submitAnswer" type="default" size="large">提交</el-button>
                <el-button @click="exportQue"  v-if = "!seen1" type="default" size="large">导出Pdf</el-button>
            </el-row>
        </el-row>
    </div>
</template>

<script>
    require("element-ui/lib/theme-default/index.css");

    import Vue from "vue";
    import router from '../../js/config/DeptRouterConfig';
    import {
        Message, Radio, RadioGroup, Button, Row, Col,Input,Form, FormItem
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


    export default {

        data(){
            return {
                topicId: process.env.TOPIC_ID,
                seqs: ["A", "B", "C", "D", "E", "F"],
                questions: [],
                answers: [],
                activeIndex: 0,
                completeAnswer: false,
                modifyAnswer: true,
                fundAccoName: '',
                idType: '',
                idNo: '',
                seen:'true',
                seen1:'true'
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
                        router.push('/one/' + this.$route.params.mobile);
                    } else {

                       // this.handleListQuestion();
                    }
                }.bind(this));
            },
            beginTest(){
                if(this.fundAccoName.trim()=="" || this.idType.trim()=="" || this.idNo.trim()==""){
                    Message("请先填写表单内容！");
                    return;
                }
                if(!/^[A-Za-z0-9]{6,18}$/.test(this.idNo.trim())){
                    Message("请输入正确的证件号码！")
                    return;
                }

                this.seen = false;
                this.handleListQuestion();
            },
            exportQue(){
                var host=process.env.BASE_PATH;
                window.open(host+"/web/question/question/createPdf?topicId="+this.topicId+"&idType="+this.idType+"&fundAccoName="+this.fundAccoName+"&idNo="+this.idNo);

//                this.$http.get('/web/question/question/createPdf',{params:{
//                    topicId: this.topicId,
//                    idType:this.idType,
//                    idNo:this.idNo,
//                    fundAccoName:this.fundAccoName
//                }}).then(function(res){
//
//                },function(){
//                    console.log('请求失败处理');
//                });

               // window.location.href = "http://localhost:8066/one/web/question/question/createPdf?topicId="+this.topicId+"&idType="+this.idType+"&fundAccoName="+this.fundAccoName
//                this.$http.jsonp("", {
//                    params: {
//                        topicId: this.topicId,
//                        idType:this.idType,
//                        idNo:this.idNo,
//                        fundAccoName:this.fundAccoName
//                    }
//                }).then(function (res) {
//                    alert('111');
//                    if (!res.data.success) {
//                        Message({
//                            showClose: true,
//                            message: "",
//                            type: "warning"
//                        });
//                    } else {
//
//                        // this.handleListQuestion();
//                    }
//                }.bind(this));
            },
            handleListQuestion() {
                this.$http.jsonp("/web/question/question/list", {
                    params: {
                        topicId: this.topicId,
                        sort: JSON.stringify([{"property": "cdate", "direction": "DESC"}, {
                            "property": "ctime",
                            "direction": "DESC"
                        }])
                    }
                }).then(function (data) {
                    let items = data.data.items;
                    this.handleInitAnswer(items);
                    this.questions = items;
                }.bind(this));
            },
            handleInitAnswer(questions){
                if (questions != null) {
                    let ans = this.answers;
                    ans = [];
                    for (let i = 0; i < questions.length; i++) {
                        let que = questions[i];
                        this.answers.push({
                            questionId: que.id,
                            answerId: ""
                        });
                    }
                }
            },
            handleNext(label){
                if (this.activeIndex < this.questions.length - 1) {
                    this.activeIndex += 1;
                } else {
                    this.completeAnswer = true;
                    this.modifyAnswer = false;
                }
            },
            submitAnswer() {
                this.$http.jsonp("/web/question/question/evaluate2", {
                    params: {
                        answerList: JSON.stringify(this.answers),
                        topicId: this.topicId,
                        fundAccoName:this.fundAccoName,
                        idType:this.idType,
                        idNo:this.idNo
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
                                fundAccoName:this.fundAccoName,
                                idType:this.idType,
                                idNo:this.idNo
                            }
                        }).then(function (res) {
                            let data = res.data.data;
                            Message({
                                showClose: true,
                                message: "您的风险等级为" + data.riskName,
                                type: "success"
                            });
                            this.seen1 = !this.seen1
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

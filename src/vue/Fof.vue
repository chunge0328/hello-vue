<style>
    .el-table .info-row {
        background: #c9e5f5;
    }

    .el-table .positive-row {
        background: #e2f0e4;
    }
</style>
<template>
    <div class="bg-white">
        <el-row>
            <el-col :span="12">&nbsp</el-col>
            <el-col :span="6">
                <header id="header" class="mui-bar mui-bar-nav">
                    <a class="mui-action-back mui-pull-left"></a>
                    <h1 class="mui-title">智能投资体验馆</h1>
                </header>
            </el-col>
        </el-row>

        <div style="margin: 20px;"></div>
        <el-row>
            <h4>组合列表查询</h4>
        </el-row>
        <div style="margin: 20px;"></div>
        <el-row>
            <el-table :data="list" style="width: 100%" :row-class-name="tableRowClassName" :default-sort = "{prop: 'bdate', order: 'descending'}">
                <el-table-column prop="name" label="组合名称"></el-table-column>
                <el-table-column prop="typeName" label="组合类型" sortable></el-table-column>
                <el-table-column prop="riskName" label="风险等级"></el-table-column>
                <el-table-column prop="bdate" label="开始日期" sortable>
                    <template scope="scope">
                        <el-icon name="time"></el-icon>
                        <span style="margin-left: 10px">{{ scope.row.bdate }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="edate" label="截止日期" sortable>
                    <template scope="scope">
                        <el-icon name="time"></el-icon>
                        <span style="margin-left: 10px">{{ scope.row.edate }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>

        <div style="margin: 20px;"></div>
        <el-row>
            <h4>领取体验金</h4>
        </el-row>
        <el-row>
            <el-col :span="6">&nbsp;</el-col>
            <el-col :span="12">
                <el-button type="primary" @click="getExperMoney()">领取体验金</el-button>
            </el-col>
        </el-row>

        <div style="margin: 20px;"></div>
        <el-row>
            <h4>新建组合</h4>
        </el-row>
        <el-row>
            <el-col :span="6">&nbsp</el-col>
            <el-col :span="12">
                <el-form :label-position="labelPosition" label-width="80px" ref="fofForm" :model="fofForm">
                    <el-row>
                        <el-form-item label="组合名称" prop="name" required>
                            <el-input type="text" v-model="fofForm.name"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="风险等级" prop="risk" required>
                            <el-select v-model="fofForm.risk" placeholder="请选择">
                                <el-option
                                        v-for="item in items"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="开始日期" prop="bdate" required>
                            <el-date-picker
                                    v-model="fofForm.bdate"
                                    type="date"
                                    placeholder="选择日期"
                                    :picker-options="pickerOptions">
                            </el-date-picker>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="截止日期" prop="edate" required>
                            <el-date-picker
                                    v-model="fofForm.edate"
                                    type="date"
                                    placeholder="选择日期"
                                    :picker-options="pickerOptions">
                            </el-date-picker>
                        </el-form-item>
                    </el-row>
                    <el-form-item>
                        <el-button type="primary" @click="newFof()">新建</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>


    </div>


</template>

<script>
    require("element-ui/lib/theme-default/index.css");
    import Vue from "vue";
    import router from '../js/config/RedRouterConfig';
    import {Util} from '../js/utils/ValidateUtils';
    import {Form, FormItem, Input, Button, Message, Row, Col, Select, Option, DatePicker,Table,TableColumn} from "element-ui";
    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(Input);
    Vue.use(Button);
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Select);
    Vue.use(Option);
    Vue.use(DatePicker);
    Vue.use(Table);
    Vue.use(TableColumn);

    export default {
        data(){
            return {
                Util: Util,
                labelPosition: 'left',
                fofForm: {
                    name: '',
                    risk: '',
                    bdate: '',
                    edate: ''
                },
                list:null,
                items: null,
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                }
            };
        },
        created: function () {
            this.init();
        },
        methods: {
            init(){
                this.$http.jsonp("/web/act/login/checkLogin", {params: {mobile: this.$route.params.mobile}}).then(function (res) {
                    if(!res.data.success){
                        Message({showClose: true,message: "请先登录",type: "warning"});
                        router.push('/one/'+this.$route.params.mobile);
                    }else{
                        /*初始化风险等级*/
                        this.$http.jsonp("/app/topicPartition/list", {
                            params: {
                                mobile: this.$route.params.mobile,
                                code: this.$route.params.mobileCode
                            }
                        }).then(function (res) {
                            this.items = res.data.items;
                            console.log(this.items);
                        }.bind(this));
                        /*获取推荐与自建投资组合*/
                        this.$http.jsonp("/app/fofApp/getAllList", {
                            params: {}
                        }).then(function (res) {
                            this.list = res.data.items;
                        }.bind(this));
                    }
                }.bind(this))

            },
            getExperMoney(){/*领取体验金*/
                this.$http.jsonp("/app/fofApp/save", {
                    params: {}
                }).then(function (res) {
                    let data = res.data;
                    Message({
                        showClose: true,
                        message: data.success ? "领取成功" : data.message,
                        type: data.success ? "success" : "error"
                    });
                }.bind(this));
            },
            inputCheck(){/*输入校验*/
                let name = this.fofForm.name;
                let risk = this.fofForm.risk;
                let bdate = this.fofForm.bdate;
                let edate = this.fofForm.edate;
                if (Util.isEmpty(name)) {
                    Message({showClose: true, message: "请输入新建组合名称", type: 'warning'});
                    return false;
                } else if (Util.isEmpty(risk)) {
                    Message({showClose: true, message: "请选择风险等级", type: 'warning'})
                } else if (Util.isEmpty(bdate)) {
                    Message({showClose: true, message: "请选择组合开始日期", type: 'warning'});
                    return false;
                } else if (Util.isEmpty(edate)) {
                    Message({showClose: true, message: "请选择组合结束日期", type: 'warning'});
                    return false;
                } else {
                    return true;
                }
            },
            newFof(){/*新建组合*/
                if (this.inputCheck()) {
                    this.$http.jsonp("/app/fofApp/saveFof", {
                        params: {
                            name: this.fofForm.name,
                            risk: this.fofForm.risk,
                            bdate: this.fofForm.bdate,
                            edate: this.fofForm.edate
                        }
                    }).then(function (res) {
                        let data = res.data;
                        if (data.success) {
                            Message({showClose: true, message: "新建组合成功", type: 'success'});
                            //router.push('/fof/' + +this.loginForm.mobile);
                        }
                    }.bind(this));
                }
            },
            tableRowClassName(row, index) {
                if (index === 1) {
                    return 'info-row';
                } else if (index === 3) {
                    return 'positive-row';
                }
                return '';
            }
        }
    }
</script>

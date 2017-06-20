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

        <el-row :gutter="20" class="top10">
            <el-col :span="4"><b>体验金：</b></el-col>
            <el-col :span="12" class="fontTitleStyle"><b>{{balance}}&nbsp;{{balance?"元":""}}</b></el-col>
            <el-col :span="12" v-show="balance==''">
                <el-button type="primary" @click="getBalance()">领取体验金</el-button>
            </el-col>
        </el-row>

        <el-row :gutter="20" class="top10">
            <el-col :span="6" class="fontTitleStyle"><b>新建组合</b></el-col>
        </el-row>
        <el-row :gutter="20" class="top10">
            <el-col :span="4"><b>组合名称：</b></el-col>
            <el-col :span="12">
                <el-input type="text" v-model="name"></el-input>
            </el-col>
        </el-row>
        <el-row :gutter="20" class="top10">
            <el-col :span="4"><b>风险等级：</b></el-col>
            <el-col :span="12">
                <el-select v-model="risk" placeholder="请选择">
                    <el-option
                            v-for="item in items"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row :gutter="20" class="top10">
            <el-col :span="4"><b>日期：</b></el-col>
            <el-col :span="6">
                <el-date-picker
                        v-model="bdate"
                        type="date"
                        placeholder="起始日期"
                        :picker-options="pickerOptions">
                </el-date-picker>
            </el-col>
            <el-col :span="6">
                <el-date-picker
                        v-model="edate"
                        type="date"
                        placeholder="截止日期"
                        :picker-options="pickerOptions">
                </el-date-picker>
            </el-col>
        </el-row>
        <el-row :gutter="20" class="top10">
            <el-col :span="4">&nbsp;</el-col>
            <el-col :span="12">
                <el-button type="primary" @click="newFof()">新建</el-button>
            </el-col>
        </el-row>

        <el-row :gutter="20" class="top10">
            <el-col :span="6"><b>组合列表查询</b></el-col>
        </el-row>
        <el-row>
            <el-table :data="list" style="width: 100%" :row-class-name="tableRowClassName"
                      :default-sort="{prop: 'bdate', order: 'descending'}">
                <el-table-column prop="name" label="组合名称"></el-table-column>
                <el-table-column prop="customerName" label="客户名称" sortable></el-table-column>
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

    </div>


</template>

<script>
    require("element-ui/lib/theme-default/index.css");
    import Vue from "vue";
    import router from '../js/config/RedRouterConfig';
    import {Util} from '../js/utils/ValidateUtils';
    import {
            Input,
            Button,
            Message,
            Row,
            Col,
            Select,
            Option,
            DatePicker,
            Table,
            TableColumn
    } from "element-ui";
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
                name: '',
                risk: '',
                bdate: null,
                edate: null,
                balance: '',
                list: null,
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
                    if (!res.data.success) {
                        Message({showClose: true, message: "请先登录", type: "warning"});
                        router.push('/one/' + this.$route.params.mobile);
                    } else {
                        /*初始化风险等级*/
                        this.$http.jsonp("/app/topicPartition/list", {
                            params: {
                                mobile: this.$route.params.mobile,
                                code: this.$route.params.mobileCode
                            }
                        }).then(function (res) {
                            this.items = res.data.items;
                        }.bind(this));
                        /*获取推荐与自建投资组合*/
                        this.$http.jsonp("/app/fofApp/getAllList", {
                            params: {}
                        }).then(function (res) {
                            this.list = res.data.items;
                        }.bind(this));
                        /*获取用户体验金*/
                        this.$http.jsonp("/app/fofApp/getMyFirstMoney", {
                            params: {}
                        }).then(function (res) {
                            this.balance = res.data.data.balance;
                        }.bind(this));
                    }
                }.bind(this))

            },
            getBalance(){/*领取体验金*/
                this.$http.jsonp("/app/fofApp/save", {
                    params: {}
                }).then(function (res) {
                    let data = res.data;
                    Message({
                        showClose: true,
                        message: data.success ? "领取成功" : data.message,
                        type: data.success ? "success" : 'error'
                    });
                    this.balance = data.data.balance;
                }.bind(this));
            },
            inputCheck(){/*输入校验*/
                let name = this.name;
                let risk = this.risk;
                let bdate = this.bdate;
                let edate = this.edate;
                if (!Util.isEmpty(name)) {
                    Message({showClose: true, message: "请输入新建组合名称", type: 'warning'});
                    return false;
                } else if (!Util.isEmpty(risk)) {
                    Message({showClose: true, message: "请选择风险等级", type: 'warning'})
                } else if (!Util.isEmpty(bdate)) {
                    Message({showClose: true, message: "请选择组合开始日期", type: 'warning'});
                    return false;
                } else if (!Util.isEmpty(edate)) {
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
                            name: this.name,
                            risk: this.risk,
                            bdate: this.bdate.format('yyyyMMdd'),
                            edate: this.edate.format('yyyyMMdd')
                        }
                    }).then(function (res) {
                        let data = res.data;
                        Message({
                            showClose: true,
                            message: data.success ? "新建组合成功" : data.message,
                            type: data.success ? 'success' : 'error'
                        });
                        this.init();
                    }.bind(this));
                }
            },
            tableRowClassName(row, index) {
                if (index % 2 == 0) {
                    return 'info-row';
                } else if (index % 2 == 1) {
                    return 'positive-row';
                }
                return '';
            }
        }
    }
</script>

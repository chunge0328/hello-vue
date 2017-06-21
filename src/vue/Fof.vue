<style>
    .el-table .info-row {
        background: #c9e5f5;
    }

    .el-table .positive-row {
        background: #e2f0e4;
    }

    .demo-table-expand {
        font-size: 0;
    }

    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
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
        <el-row :gutter="20" class="top10">
            <el-table :data="list" style="width: 100%" :row-class-name="tableRowClassName" height="350">
                <el-table-column type="expand">
                    <template scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="组合名称">{{ props.row.name }}</el-form-item>
                            <el-form-item label="组合类型"><span>{{ props.row.typeName }}</span></el-form-item>
                            <el-form-item label="风险等级"><span>{{ props.row.riskName }}</span></el-form-item>
                            <el-form-item label="开始日期"><span>{{ props.row.bdate }}</span></el-form-item>
                            <el-form-item label="截止日期"><span>{{ props.row.edate }}</span></el-form-item>
                            <el-form-item label="购买金额">
                                <span><el-input type="text" v-model="amount"></el-input>
                                <el-button @click.native.prevent="buy(props.row)" type="primary">
                                            购买
                                        </el-button></span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>

                <el-table-column prop="name" label="组合名称"></el-table-column>
                <el-table-column prop="typeName" label="组合类型" sortable></el-table-column>
                <el-table-column prop="riskName" label="风险等级"></el-table-column>
                <el-table-column prop="bdate" label="开始日期" sortable></el-table-column>
                <el-table-column prop="edate" label="截止日期" sortable></el-table-column>
            </el-table>
        </el-row>

        <el-row :gutter="20" class="top10">
            <el-col :span="6"><b>资金流水</b></el-col>
        </el-row>
        <el-row :gutter="20" class="top10">
            <el-table :data="capitallist" style="width: 100%" :row-class-name="tableRowClassName" height="300">
                <el-table-column prop="typeName" label="类型"></el-table-column>
                <el-table-column prop="stypeName" label="业务类型"></el-table-column>
                <el-table-column prop="amount" label="金额"></el-table-column>
                <el-table-column prop="balance" label="余额"></el-table-column>
                <el-table-column prop="cdate" label="交易日期"></el-table-column>
                <el-table-column prop="ctime" label="交易时间"></el-table-column>
            </el-table>
        </el-row>

        <el-row :gutter="20" class="top10">
            <el-col :span="6"><b>交易记录</b></el-col>
        </el-row>
        <el-row :gutter="20" class="top10">
            <el-table :data="tradelist" style="width: 100%" :row-class-name="tableRowClassName" height="300">
                <el-table-column prop="name" label="组合"></el-table-column>
                <el-table-column prop="fundCode" label="基金代码"></el-table-column>
                <el-table-column prop="typeName" label="业务类型"></el-table-column>
                <el-table-column prop="amount" label="金额"></el-table-column>
                <el-table-column prop="balance" label="份额"></el-table-column>
                <el-table-column prop="nav" label="净值"></el-table-column>
                <el-table-column prop="cdate" label="交易日期"></el-table-column>
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
                cid: '',
                Util: Util,
                labelPosition: 'left',
                name: '',
                risk: '',
                bdate: null,
                edate: null,
                balance: '',
                list: null,
                items: null,
                fundlist: null,//基金列表
                capitallist: '',//资金流水列表
                tradelist: '',//交易记录列表
                amount: '',
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
                        this.cid = res.data.data.cid;
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
                        /*获取基金列表信息*/
                        this.$http.jsonp("/app/fofApp/getFundList", {
                            params: {}
                        }).then(function (res) {
                            this.fundlist = res.data.items;
                        }.bind(this));
                        /*获取我的资金流水*/
                        this.$http.jsonp("/app/fofApp/getCapitalFlow", {
                            params: {
                                customerId: this.cid
                            }
                        }).then(function (res) {
                            this.capitallist = res.data.items;
                        }.bind(this));
                        /*获取交易记录列表*/
                        this.$http.jsonp("/app/fofApp/getTradelist", {
                            params: {
                                customerId: this.cid
                            }
                        }).then(function (res) {
                            this.tradelist = res.data.items;
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
                let bdate = this.bdate;
                let edate = this.edate;
                if (!Util.isEmpty(name)) {
                    Message({showClose: true, message: "请输入新建组合名称", type: 'warning'});
                    return false;
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
            },
            buy(row){/*购买基金组合*/
                if (!Util.isEmpty(this.amount)) {
                    Message({
                        showClose: true,
                        message: "请输入购买金额",
                        type: 'warning'
                    });
                    return;
                } else {
                    console.log(row.id);
                    this.$http.jsonp("/app/fofApp/fofTrs", {
                        params: {
                            fofId: row.id,
                            stype: "1",//申购
                            amount: this.amount
                        }
                    }).then(function (res) {
                        let data = res.data;
                        Message({
                            showClose: true,
                            message: data.success ? "购买成功" : data.message,
                            type: data.success ? 'success' : 'error'
                        });
                        this.amount = '';
                        if(data.success){
                            this.init();
                        }
                    }.bind(this));
                }
            }
        }
    }
</script>

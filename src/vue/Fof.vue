<style>
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

        <el-row :gutter="20" class="top10" v-for="(fund, ind) in funds" :key="ind">
            <el-col :span="4" v-if="ind == '0'"><b>组合基金：</b></el-col>
            <el-col :span="4" v-if="ind != '0'">&nbsp;</el-col>
            <el-col :span="6">
                <el-select v-model="fund.fundCode" placeholder="请选择">
                    <el-option
                            v-for="item in fundlist"
                            :key="item.fundCode"
                            :label="item.fundName"
                            :value="item.fundCode">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="6">
                    <el-input type="text" v-model="fund.weight" placeholder="仓位"></el-input>
            </el-col>
            <el-col :span="4" v-if="ind == '0'">
                <el-button type="primary" @click="addFundForm()"><i class="el-icon-plus"></i></el-button>
            </el-col>
            <el-col :span="6" v-if="ind != '0'">
                <el-button type="primary" @click="delFundForm(fund, ind)"><i class="el-icon-minus"></i></el-button>
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
            <el-table :data="list" style="width: 100%">
                <el-table-column type="expand">
                    <template scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="组合名称">{{ props.row.name }}</el-form-item>
                            <el-form-item label="组合类型"><span>{{ props.row.typeName }}</span></el-form-item>
                            <el-form-item label="风险等级" v-if="props.row.riskName"><span>{{ props.row.riskName }}</span></el-form-item>
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
                <el-table-column label="风险等级">
                    <template scope="scope">
                        {{scope.row.riskName == null?'-':scope.row.riskName}}
                    </template>
                </el-table-column>
                <el-table-column prop="bdate" label="开始日期" sortable></el-table-column>
                <el-table-column prop="edate" label="截止日期" sortable></el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button @click.native.prevent="queryFund(scope.row)" type="text" size="small">
                            查看基金
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>

        <el-dialog title="基金明细" :visible.sync="dialogTableVisible">
            <el-table :data="myfundlist">
                <el-table-column property="fundCode" label="基金代码"></el-table-column>
                <el-table-column property="fundName" label="基金名称"></el-table-column>
                <el-table-column property="weight" label="仓位"></el-table-column>
            </el-table>
        </el-dialog>

        <el-row :gutter="20" class="top10">
            <el-col :span="6"><b>资金流水</b></el-col>
        </el-row>
        <el-row :gutter="20" class="top10">
            <el-table :data="capitallist" style="width: 100%">
                <el-table-column prop="typeName" label="类型"></el-table-column>
                <el-table-column prop="stypeName" label="业务类型"></el-table-column>
                <el-table-column prop="amount" label="金额"></el-table-column>
                <el-table-column prop="balance" label="余额"></el-table-column>
                <el-table-column prop="cdate" label="交易日期"></el-table-column>
                <el-table-column prop="ctime" label="交易时间"></el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button @click.native.prevent="queryMoneyDetail(scope.row)" type="text" size="small">
                            明细
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>

        <el-dialog title="资金流水明细" :visible.sync="dialogMoneyDetailVisible">
            <el-table :data="moneyDetaillist">
                <el-table-column property="name" label="组合"></el-table-column>
                <el-table-column property="fundName" label="基金名称"></el-table-column>
                <el-table-column property="amount" label="金额"></el-table-column>
                <el-table-column label="份额">
                    <template scope="scope">
                        {{scope.row.balance == null?'-':scope.row.balance}}
                    </template>
                </el-table-column>
                <el-table-column label="净值">
                    <template scope="scope">
                        {{scope.row.nav == null?'-':scope.row.nav}}
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template scope="scope">
                        {{scope.row.state == '1'?'申请':'确认'}}
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>

        <el-row :gutter="20" class="top10">
            <el-col :span="6"><b>交易记录</b></el-col>
        </el-row>
        <el-row :gutter="20" class="top10">
            <el-table :data="tradelist" style="width: 100%" height="300">
                <el-table-column prop="name" label="组合"></el-table-column>
                <el-table-column prop="fundName" label="基金名称"></el-table-column>
                <el-table-column prop="typeName" label="业务类型"></el-table-column>
                <el-table-column prop="amount" label="金额"></el-table-column>
                <el-table-column label="份额">
                    <template scope="scope">
                        {{scope.row.balance == null?'-':scope.row.balance}}
                    </template>
                </el-table-column>
                <el-table-column label="净值">
                    <template scope="scope">
                        {{scope.row.nav == null?'-':scope.row.nav}}
                    </template>
                </el-table-column>
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
            TableColumn,
            Dialog
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
    Vue.use(Dialog);

    function getBaseData() {
        return {fundCode:"", weight: ""};
    }
    export default {
        data(){
            return {
                dialogTableVisible: false,
                dialogMoneyDetailVisible:false,
                cid: null,
                Util: Util,
                riskLevel: "",
                labelPosition: 'left',
                name: "",
                risk: "",
                bdate: null,
                edate: null,
                balance: "",
                list: null,
                items: null,
                moneyDetaillist:null,//根据资金流水ID查回交易明细
                myfundlist:null,//根据组合ID查回的基金列表
                fundlist: null,//基金列表
                capitallist: null,//资金流水列表
                tradelist: null,//交易记录列表
                amount: null,
                funds: [getBaseData()],
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
                        /*获取客户风险等级*/
                        this.$http.jsonp("/app/question/queUser/getRiskInfo", {
                            params: {}
                        }).then(function (res) {
                            let data = res.data.data;
                            if (data) {
                                this.riskLevel = data.riskLevel;
                            }
                            /*获取推荐与自建投资组合*/
                            this.$http.jsonp("/app/fofApp/getAllList", {
                                params: {
                                    risk: this.riskLevel,
                                    sort: JSON.stringify([{"property": "cdate", "direction": "DESC"}, {
                                        "property": "ctime",
                                        "direction": "DESC"
                                    }])
                                }
                            }).then(function (res) {
                                this.list = res.data.items;
                            }.bind(this));
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
                                customerId: this.cid,
                                sort: JSON.stringify([{"property": "cdate", "direction": "DESC"}, {
                                    "property": "ctime",
                                    "direction": "DESC"
                                }])
                            }
                        }).then(function (res) {
                            this.capitallist = res.data.items;
                        }.bind(this));
                        /*获取交易记录列表*/
                        this.$http.jsonp("/app/fofApp/getTradelist", {
                            params: {
                                customerId: this.cid,
                                sort: JSON.stringify([{"property": "cdate", "direction": "DESC"}, {
                                    "property": "ctime",
                                    "direction": "DESC"
                                }])
                            }
                        }).then(function (res) {
                            this.tradelist = res.data.items;
                        }.bind(this));
                    }
                }.bind(this))
            },
            addFundForm() {/*增加组合基金*/
                if (this.funds.length >= 5) {
                    Message({showClose: true, message: "组合最多添加5个基金", type: "warning"});
                    return;
                }
                this.funds.push(getBaseData());
            },/*删除组合基金*/
            delFundForm(obj, ind) {
                this.funds.pop(ind);
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
                            funds: JSON.stringify(this.funds),
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
            queryFund(row){/*根据组合ID查询组合的基金列表*/
                this.dialogTableVisible = true;
                this.$http.jsonp("/app/fofApp/getFofFundList", {
                    params: {
                        fofId: row.id,
                        sort: JSON.stringify([{"property": "cdate", "direction": "DESC"}, {
                            "property": "ctime",
                            "direction": "DESC"
                        }])
                    }
                }).then(function (res) {
                    this.myfundlist = res.data.items;
                }.bind(this));
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
                        if (data.success) {
                            this.init();
                        }
                    }.bind(this));
                }
            },
            queryMoneyDetail(row){/*资金流水明细*/
                this.dialogMoneyDetailVisible = true;
                this.$http.jsonp("/app/fofApp/getTradelist", {
                    params: {
                        moneyId: row.id,
                        sort: JSON.stringify([{"property": "cdate", "direction": "DESC"}, {
                            "property": "ctime",
                            "direction": "DESC"
                        }])
                    }
                }).then(function (res) {
                    this.moneyDetaillist = res.data.items;
                }.bind(this));
            }
        }
    }
</script>

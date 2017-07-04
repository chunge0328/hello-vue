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
    <div class="bg-white bgwidth">
        <el-row>
            <el-col :span="8">&nbsp</el-col>
            <el-col :span="10">
                <header id="header" class="mui-bar mui-bar-nav">
                    <a class="mui-action-back mui-pull-left"></a>
                    <h1 class="mui-title">智能投资体验馆</h1>
                </header>
            </el-col>
        </el-row>

        <el-row :gutter="20" class="top10">
            <el-col :span="4"><b>体验金：</b></el-col>
            <el-col :span="6" class="fontTitleStyle"><b>{{balance?balance+"元":""}}</b>
                <el-button type="primary" @click="getBalance()" v-show="balance==0">领取体验金</el-button>
            </el-col>
            <el-col :span="4" v-show="cusbalance>0"><b>余额：</b></el-col>
            <el-col :span="6" class="fontTitleStyle"><b>{{cusbalance}}元</b></el-col>
        </el-row>

        <el-row :gutter="20" class="top10">
            <el-col :span="4"><b>未确认金额：</b></el-col>
            <el-col :span="6" class="fontTitleStyle"><b>{{totalEnEnsureBalance}}&nbsp;元</b>
            </el-col>
            <el-col :span="4"><b>已确认份额：</b></el-col>
            <el-col :span="6" class="fontTitleStyle"><b>{{totalEnsureBalance.toFixed(4)}}&nbsp;元</b>
            </el-col>
        </el-row>


        <el-row :gutter="20" class="top10" v-show="balance>0">
            <div id="container2"></div>
        </el-row>
        <el-row :gutter="20" class="top10" v-show="balance>0">
            <div id="container3"></div>
        </el-row>
        <el-row :gutter="20" class="top10" v-show="totalEnEnsureBalance>0">
            <div id="container1"></div>
        </el-row>
        <el-row :gutter="20" class="top10" v-show="totalEnEnsureBalance>0">
            <div id="container"></div>
        </el-row>


        <el-row :gutter="20" class="top10">
            <el-col :span="4"><b>风险等级：</b></el-col>
            <el-col :span="12" class="fontTitleStyle"><b>{{riskName}}&nbsp;</b>
                <el-button type="primary" @click="skipQuestion()" v-show="riskName==''">问卷调查</el-button>
            </el-col>
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
                <el-select v-model="fund.fundCode" @change="filterFundList" placeholder="请选择">
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
            <el-table :data="list" width="100%">
                <el-table-column type="expand">
                    <template scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="组合名称">{{ props.row.name }}</el-form-item>
                            <el-form-item label="组合类型"><span>{{ props.row.typeName }}</span></el-form-item>
                            <el-form-item label="风险等级" v-if="props.row.riskName"><span>{{ props.row.riskName }}</span>
                            </el-form-item>
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
                        <el-button @click.native.prevent="queryFund(scope.row)" type="danger" size="small">
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
                <el-table-column property="weight" label="仓位(%)"></el-table-column>
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
                        <el-button @click.native.prevent="queryMoneyDetail(scope.row)" type="danger" size="small">
                            明细
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top: 20px;">
                <div class="block">
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="1"
                            :page-sizes="[5, 10, 15, 20]"
                            :page-size="limit"
                            layout="total, sizes, prev, pager, next"
                            :total="capitallistlength">
                    </el-pagination>
                </div>
            </div>
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
            <el-table :data="tradelist" style="width: 100%">
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
            <div style="margin-top: 20px;">
                <div class="block">
                    <el-pagination
                            @size-change="handleTradeSizeChange"
                            @current-change="handleTradeCurrentChange"
                            :current-page="1"
                            :page-sizes="[5, 10, 15, 20]"
                            :page-size="tradeLimit"
                            layout="total, sizes, prev, pager, next"
                            :total="tradelistlength">
                    </el-pagination>
                </div>
            </div>
        </el-row>

        <el-row :gutter="20" class="top10">
            <el-col ><b>客户资产排名</b>
                <el-button @click="exportExcel()" type="danger" size="small">
                    导出Excel
                </el-button>
            </el-col>
        </el-row>
        <el-row :gutter="20" class="top10">
            <el-table :data="fofAssetRanklist" style="width: 100%">
                <el-table-column prop="rankNum" label="排名" width="80"></el-table-column>
                <el-table-column prop="customerName" label="客户姓名"></el-table-column>
                <el-table-column prop="mobile" label="手机号" width="130"></el-table-column>
                <el-table-column prop="useableBalance" label="余额"></el-table-column>
                <el-table-column prop="unEnsureBalance" label="未确认金额"></el-table-column>
                <el-table-column prop="ensureBalance" label="已确认金额"></el-table-column>
                <el-table-column prop="totBalance" label="总资产"></el-table-column>
            </el-table>
            <div style="margin-top: 20px;">
                <div class="block">
                    <el-pagination
                            @size-change="handleAssetRankSizeChange"
                            @current-change="handleAssetRankCurrentChange"
                            :current-page="1"
                            :page-sizes="[5, 10, 15, 20]"
                            :page-size="rankLimit"
                            layout="total, sizes, prev, pager, next"
                            :total="fofAssetRanklistlength">
                    </el-pagination>
                </div>
            </div>
        </el-row>
    </div>
</template>

<script>
    require("element-ui/lib/theme-default/index.css");
    import Vue from "vue";
    import Highcharts from 'highcharts';
    import Drilldown from '../../js/plugins/drilldown';
    import Sandsignika from '../../js/plugins/sand-signika';
    import Exporting from '../../js/plugins/exporting'
    import router from '../../js/config/OneRouterConfig';
    import {Util} from '../../js/utils/ValidateUtils';
    Drilldown(Highcharts);
    Sandsignika(Highcharts);
    Exporting(Highcharts);
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
        return {fundCode: "", weight: ""};
    }

    Highcharts.setOptions({
        lang: {
            downloadJPEG: "下载 JPEG 图片",
            downloadPDF: "下载 PDF 文件",
            downloadPNG: "下载 PNG 文件",
            downloadSVG: "下载 SVG 文件",
            downloadXML: "下载 XML 文件",
            printChart: "打印图表"
        }
    });

    export default {
        data(){
            return {
                basePath: process.env.BASE_PATH + '/app/fofApp/exportFofAssetRankExcel',
                dialogTableVisible: false,
                dialogMoneyDetailVisible: false,
                cid: null,
                Util: Util,
                riskLevel: "",
                riskName: "",
                labelPosition: 'left',
                name: "",
                risk: "",
                bdate: null,
                edate: null,
                balance: 0.0,
                cusbalance: 0.0,
                list: null,
                items: null,
                moneyDetaillist: null,//根据资金流水ID查回交易明细
                myfundlist: null,//根据组合ID查回的基金列表
                cacheFundlist: null,//基金列表
                fundlist: null,//基金列表
                capitallist: null,//资金流水列表
                capitallistlength: 0,
                tradelist: null,//交易记录列表
                tradelistlength: 0,
                amount: null,
                funds: [getBaseData()],
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                page: 1,
                limit: 5,
                tradePage: 1,
                tradeLimit: 5,
                holdFofList: null,
                holdFofArray: [],
                totalEnEnsureBalance: 0.0,//未确认金额
                totalEnsureBalance: 0.0,//已确认份额
                fofAssetRanklist: null,//资产排名
                fofAssetRanklistlength: 0,
                rankPage: 1,
                rankLimit: 5
            };
        },
        created: function () {
            this.init();
        },
        methods: {
            init(){
                /*判断是否登录*/
                this.$http.jsonp("/web/act/login/checkLogin", {params: {mobile: this.$route.params.mobile}}).then(function (res) {
                    if (!res.data.success) {
                        Message({showClose: true, message: "请先登录", type: "warning"});
                        router.push('/one/' + this.$route.params.mobile);
                    } else {
                        this.cid = res.data.data.cid;
                        /*获取客户风险等级*/
                        this.getRiskInfo();
                        /*获取推荐与自建投资组合*/
                        this.getAllList();
                        /*获取用户体验金*/
                        this.getMyFirstMoney();
                        /*查询客户余额*/
                        this.getMyBalance();
                        /*获取基金列表信息*/
                        this.getFundList();
                        /*获取我的资金流水*/
                        this.getMoneyTrade();
                        /*获取交易记录列表*/
                        this.getTrades();
                        /*我的持仓组合*/
                        this.getHoldFof();
                        /*获取资产排名*/
                        this.getFofAssetRank();
                    }
                }.bind(this))
            },
            getRiskInfo(){/*获取客户风险等级*/
                this.$http.jsonp("/app/question/queUser/getRiskInfo", {
                    params: {}
                }).then(function (res) {
                    let data = res.data.data;
                    if (data) {
                        this.riskLevel = data.riskLevel;
                        this.riskName = data.riskName;
                    }
                }.bind(this));
            },
            getAllList(){
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
            },
            getMyFirstMoney(){/*获取用户体验金*/
                this.$http.jsonp("/app/fofApp/getMyFirstMoney", {
                    params: {}
                }).then(function (res) {
                    this.balance = res.data.data ? res.data.data.balance : 0.0;
                }.bind(this));
            },
            getMyBalance(){/*查询客户余额*/
                this.$http.jsonp("/app/fofApp/getMyBalance", {
                    params: {}
                }).then(function (res) {
                    this.cusbalance = res.data ? res.data.balance : 0.0;
                }.bind(this));
            },
            getFundList(){/*获取基金列表信息*/
                this.$http.jsonp("/app/fofApp/getFundList", {
                    params: {}
                }).then(function (res) {
                    this.cacheFundlist = this.fundlist = res.data.items;
                }.bind(this));
            },
            getMoneyTrade(){/*获取我的资金流水*/
                this.$http.jsonp("/app/fofApp/getCapitalFlow", {
                    params: {
                        customerId: this.cid,
                        page: this.page,
                        limit: this.limit,
                        sort: JSON.stringify([{"property": "cdate", "direction": "DESC"}, {
                            "property": "ctime",
                            "direction": "DESC"
                        }])
                    }
                }).then(function (res) {
                    this.capitallist = res.data.items;
                    this.capitallistlength = res.data.total;
                }.bind(this));
            },
            getTrades(){/*获取交易记录列表*/
                this.$http.jsonp("/app/fofApp/getTradelist", {
                    params: {
                        customerId: this.cid,
                        page: this.tradePage,
                        limit: this.tradeLimit,
                        sort: JSON.stringify([{"property": "cdate", "direction": "DESC"}, {
                            "property": "ctime",
                            "direction": "DESC"
                        }])
                    }
                }).then(function (res) {
                    this.tradelist = res.data.items;
                    this.tradelistlength = res.data.total;
                }.bind(this));
            },
            addFundForm() {/*增加组合基金*/
                if (this.funds.length >= 5) {
                    Message({showClose: true, message: "组合最多添加5个基金", type: "warning"});
                    return;
                }
                this.funds.push(getBaseData());
            }, /*删除组合基金*/
            delFundForm(obj, ind) {
                this.funds.pop(ind);
                this.filterFundList();
            },
            filterFundList() {/*处理下拉框的选项*/
                this.fundlist = this.cacheFundlist.filter(function (fund, funds) {
                    let contains = false;
                    for(let i =0; i<this.funds.length; i++) {
                        let tmpFund = this.funds[i];
                        let tmpFundCode = tmpFund.fundCode;
                        if(tmpFundCode === fund.fundCode) {
                            contains = true;
                            break;
                        }
                    }
                    return !contains;
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
                } else if (this.funds.length < 2) {
                    Message({showClose: true, message: "组合至少添加2个基金", type: "warning"});
                    return;
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
            },
            skipQuestion(){/*跳转问卷*/
                router.push('/question/' + this.$route.params.mobile);
            },
            handleSizeChange(val) {
                this.limit = val;
                this.getMoneyTrade();
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getMoneyTrade();
            },
            handleTradeSizeChange(val) {
                this.tradeLimit = val;
                this.getTrades();
            },
            handleTradeCurrentChange(val) {
                this.tradePage = val;
                this.getTrades();
            },
            handleAssetRankSizeChange(val) {
                this.rankLimit = val;
                this.getFofAssetRank();
            },
            handleAssetRankCurrentChange(val) {
                this.rankPage = val;
                this.getFofAssetRank();
            },
            getHoldFof(){/*我的持仓组合*/
                this.$http.jsonp("/app/fofApp/getHoldFof", {
                    params: {}
                }).then(function (res) {
                    this.holdFofList = res.data.items;
                    for (let i = 0; i < res.data.total; i++) {
                        let arr = [];
                        this.totalEnEnsureBalance += this.holdFofList[i].unEnsureBalance;
                        this.totalEnsureBalance += this.holdFofList[i].ensureBalance;
                        arr.push(this.holdFofList[i].fofName);
                        arr.push(this.holdFofList[i].ensureBalance);
                        this.holdFofArray.push(arr);
                    }
                    /* 绘制饼图表*/
                    this.handleDrawChart();
                    /*绘制双饼图*/
                    this.getDrawTwoChart();
                    /*绘制柱状图*/
                    this.drawColumn();
                    /*绘制双柱状图*/
                    this.drawDrillFof();
                }.bind(this));
            },
            handleDrawChart() {/* 绘制饼图表*/
                new Highcharts.Chart('container',
                    {
                        credits: {
                            enabled: false//去除版权
                        },
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false
                        },
                        title: {
                            floating: true,
                            text: '<b>投资组合分析</b>'
                        },
                        tooltip: {
                            headerFormat: '{series.name}<br>',
                            pointFormat: '{point.name}: <b>{point.percentage:,.2f}%</b>'
                        },
                        legend: {
                            align: "center", //程度标的目标地位
                            verticalAlign: "bottom", //垂直标的目标地位
                            x: 0, //间隔x轴的间隔
                            y: 0, //间隔Y轴的间隔
                            labelFormatter: function () {
                                return this.name + '<br>' + this.y + '元';
                            }
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                showInLegend: true,
                                colors: Highcharts.getOptions().colors,
                                dataLabels: {
                                    enabled: true,
                                    formatter: function () {
                                        // 大于1则显示
                                        return this.y > 1 ? '<b>' + this.point.name + ':</b> ' + '¥' + this.y : null;
                                    }
                                },
                                slicedOffset: 10,         // 突出间距
                                point: {
                                    plotShadow: false,
                                    events: {
                                        // 鼠标滑过是，突出当前扇区
                                        mouseOver: function () {
                                            this.slice();
                                        },
                                        // 鼠标移出时，收回突出显示
                                        mouseOut: function () {
                                            this.slice();
                                        },
                                        // 默认是点击突出，这里屏蔽掉
                                        click: function () {
                                            return false;
                                        }
                                    }
                                }
                            }
                        },
                        series: [{
                            type: 'pie',
                            size: 200,
                            innerSize: '60%',
                            name: '组合分配',
                            data: this.holdFofArray,
                            states: {
                                hover: {
                                    enabled: false //去除鼠标浮上去时饼图的阴影
                                }
                            }
                        }]
                    });
            },
            getDrawTwoChart(){/*画双饼图，内环为组合，外环为组合的基金*/
                //对数据进行处理
                let fofData = this.holdFofList;
                let colors = Highcharts.getOptions().colors,
                    categories = [],
                    data = [],
                    browserData = [],
                    fundData = [],
                    i, j, drillDataLen, brightness;
                for (i = 0; i < fofData.length; i++) {
                    let items = fofData[i].items;
                    let itemData = [], itemcategories = [];
                    for (j = 0; j < items.length; j++) {
                        itemData.push(items[j].ensureBalance);
                        itemcategories.push(items[j].fundName);
                    }
                    categories.push(fofData[i].fofName);
                    data.push({
                        y: fofData[i].ensureBalance,
                        color: colors[i],
                        drilldown: {
                            name: '基金',
                            categories: itemcategories,
                            data: itemData,
                            color: colors[i]
                        }
                    })
                }
                //把数据塞到browserData，fundData中
                for (i = 0; i < data.length; i++) {
                    //添加组合数据
                    browserData.push({
                        name: categories[i],
                        y: data[i].y,
                        color: data[i].color
                    });
                    //根据组合添加基金数据
                    drillDataLen = data[i].drilldown.data.length;
                    for (j = 0; j < drillDataLen; j++) {
                        brightness = 0.2 - (j / drillDataLen) / 5;
                        fundData.push({
                            name: data[i].drilldown.categories[j],
                            y: data[i].drilldown.data[j],
                            color: Highcharts.Color(data[i].color).brighten(brightness).get()
                        });
                    }
                }

                //画双饼图
                new Highcharts.Chart('container1',
                    {
                        credits: {
                            enabled: false//去除版权
                        },
                        chart: {
                            type: 'pie'
                        },
                        title: {
                            text: '<b>智能投资组合</b>'
                        },
                        subtitle: {
                            text: '内环为基金组合，外环为组合的基金'
                        },
                        plotOptions: {
                            pie: {
                                shadow: false,
                                center: ['50%', '50%']
                            }
                        },
                        series: [{
                            name: '基金组合',
                            data: browserData,
                            size: '60%',
                            dataLabels: {
                                formatter: function () {
                                    return this.y > 5 ? '<b>' + this.point.name + ':</b> ' + '¥' + this.y : null;
                                },
                                color: 'white',
                                distance: -30
                            }
                        }, {
                            name: '基金',
                            data: fundData,
                            size: '80%',
                            innerSize: '60%',
                            dataLabels: {
                                formatter: function () {
                                    // 大于1则显示
                                    return this.y > 1 ? '<b>' + this.point.name + ':</b> ' + '¥' + this.y : null;
                                }
                            }
                        }]
                    });
            },
            drawColumn(){/*资产分布图*/
                new Highcharts.Chart('container2',
                    {
                        credits: {
                            enabled: false//去除版权
                        },
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: '<b>我的资产分布</b>'
                        },
                        xAxis: {
                            type: 'category'
                        },
                        yAxis: {
                            title: {
                                text: '金额'
                            }
                        },
                        legend: {
                            enabled: false
                        },
                        plotOptions: {
                            series: {
                                borderWidth: 0,
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.y:,.2f}'
                                }
                            }
                        },
                        tooltip: {
                            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                            pointFormat: '<b>{point.name}</b>: <b>{point.y:,.2f}</b>'
                        },
                        series: [{
                            name: '<b>我的</b>',
                            colorByPoint: true,
                            data: [{
                                name: '<b>体验金</b>',
                                y: this.balance
                            }, {
                                name: '<b>余额</b>',
                                y: this.cusbalance
                            }, {
                                name: '<b>已确认份额</b>',
                                y: this.totalEnsureBalance
                            }, {
                                name: '<b>未确认金额</b>',
                                y: this.totalEnEnsureBalance
                            }, {
                                name: '<b>已确认份额</b>',
                                y: this.totalEnsureBalance
                            }]
                        }]
                    });
            },
            drawDrillFof(){/*绘制双柱状图*/
                let fofData = this.holdFofList,//基金组合
                    data = [], drilldownData = [], i, j;
                for (i = 0; i < fofData.length; i++) {
                    data.push({
                        name: fofData[i].fofName,
                        y: fofData[i].ensureBalance,
                        drilldown: fofData[i].fofName
                    });
                    let items = fofData[i].items, seriesData = [];
                    for (j = 0; j < items.length; j++) {
                        let k = 0, itemData = [];
                        itemData[k++] = items[j].fundName;
                        itemData[k++] = items[j].ensureBalance;
                        seriesData[j] = itemData;
                    }
                    drilldownData.push({
                        name: fofData[i].fofName,
                        id: fofData[i].fofName,
                        data: seriesData
                    });
                }
                /*双柱状图*/
                new Highcharts.Chart('container3',
                    {
                        credits: {
                            enabled: false//去除版权
                        },
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: '<b>投资组合</b>'
                        },
                        subtitle: {
                            text: '<b>点击柱状图可查看组合的基金</b>'
                        },
                        xAxis: {
                            type: 'category'
                        },
                        yAxis: {
                            title: {
                                text: '金额'
                            }
                        },
                        legend: {
                            enabled: false
                        },
                        plotOptions: {
                            series: {
                                borderWidth: 0,
                                dataLabels: {
                                    enabled: true,
                                    format: '¥{point.y:,.2f}'
                                }
                            }
                        },
                        tooltip: {
                            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:,.2f}</b>'
                        },
                        series: [{
                            name: '组合',
                            colorByPoint: true,
                            data: data
                        }],
                        drilldown: {
                            series: drilldownData
                        }
                    });
            },
            getFofAssetRank(){/*获取资产排名*/
                this.$http.jsonp("/app/fofApp/queryFofAssetRank", {
                    params: {
                        page:this.rankPage,
                        limit:this.rankLimit
                    }
                }).then(function (res) {
                    this.fofAssetRanklist = res.data.items;
                    this.fofAssetRanklistlength = res.data.total;
                }.bind(this));
            },
            exportExcel(){/*导出资产排名*/
                window.open(this.basePath);
            }
        }
    }
</script>

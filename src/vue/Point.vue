<style>
    .el-table .info-row {
        background: #c9e5f5;
    }

    .pointColor {
        color: #cc0000;
        font-size: 2em;
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
                    <h1 class="mui-title">积分</h1>
                </header>
            </el-col>
        </el-row>

        <div style="margin: 20px;"></div>
        <el-row>
            <h4>我的总积分</h4>
        </el-row>
        <div style="margin: 20px;"></div>
        <el-row>
            <el-col :span="6">&nbsp;</el-col>
            <el-col :span="6" class="pointColor">
                {{myPoint}}&nbsp;{{myPoint?"分":""}}
            </el-col>
        </el-row>

        <div style="margin: 20px;"></div>
        <el-row>
            <h4>签到</h4>
        </el-row>
        <div style="margin: 20px;"></div>
        <el-row>
            <el-col :span="6">&nbsp;</el-col>
            <el-col :span="6">
                <el-button type="primary" @click="sign()">签到</el-button>
            </el-col>
        </el-row>

        <div style="margin: 20px;"></div>
        <el-row>
            <h4>我的积分明细</h4>
        </el-row>
        <div style="margin: 20px;"></div>
        <el-row>
            <el-button type="primary" @click="getMyPointDetail()">查询</el-button>
        </el-row>
        <div style="margin: 20px;"></div>
        <el-row>
            <el-table :data="pointDetail" style="width: 100%" :row-class-name="tableRowClassName"
                      :default-sort="{prop: 'cdate', order: 'descending'}">
                <el-table-column prop="fromName" label="来源" sortable></el-table-column>
                <el-table-column prop="giftName" label="消费" sortable></el-table-column>
                <el-table-column prop="point" label="积分"></el-table-column>
                <el-table-column prop="balance" label="余额"></el-table-column>
                <el-table-column prop="cdate" label="交易日期" sortable>
                    <template scope="scope">
                        <el-icon name="time"></el-icon>
                        <span style="margin-left: 10px">{{ scope.row.cdate }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>


        <div style="margin: 20px;"></div>
        <el-row>
            <h4>积分礼品</h4>
        </el-row>
        <div style="margin: 20px;"></div>
        <el-row>
            <el-table :data="giftList" style="width: 100%" :row-class-name="tableRowClassName">
                <el-table-column prop="name" label="礼品名称"></el-table-column>
                <el-table-column prop="con" label="条件"></el-table-column>
                <el-table-column prop="remark" label="说明"></el-table-column>
                <el-table-column prop="point" label="需要积分"></el-table-column>
                <el-table-column fixed="right" label="操作">
                    <template scope="scope">
                        <el-button @click.native.prevent="convert(scope.$index, giftList)" type="text" size="small">
                            兑换
                        </el-button>
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
    import {Input, Button, Message, Row, Col, Select, Option, Table, TableColumn, Icon} from "element-ui";
    Vue.use(Input);
    Vue.use(Button);
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Select);
    Vue.use(Option);
    Vue.use(Table);
    Vue.use(TableColumn);
    Vue.use(Icon);

    export default {
        data(){
            return {
                Util: Util,
                labelPosition: 'left',
                giftList: null,
                pointDetail: null,
                myPoint: ''
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
                        /*获取我的总积分*/
                        this.$http.jsonp("/app/point/getTotalPoint", {
                            params: {}
                        }).then(function (res) {
                            let data = res.data;
                            this.myPoint = data.data.balance;
                        }.bind(this));
                        /*获取积分礼品列表*/
                        this.$http.jsonp("/app/point/giftList", {
                            params: {}
                        }).then(function (res) {
                            this.giftList = res.data.items;
                        }.bind(this));
                    }
                }.bind(this))

            },
            sign(){
                this.$http.jsonp("/app/point/get", {
                    params: {rule: 'f9c00eaa-a400-4119-a4dd-acbb115d84ed'}
                }).then(function (res) {
                    let data = res.data;
                    Message({
                        showClose: true,
                        message: data.success ? "签到成功" : data.message,
                        type: data.success ? "success" : "error"
                    });
                    if (data.success) {
                        this.init();
                    }
                }.bind(this));
            },
            getMyPointDetail(){/*获取我的积分明细*/
                this.$http.jsonp("/app/point/getMyPointDetail", {
                    params: {}
                }).then(function (res) {
                    this.pointDetail = res.data.items;
                }.bind(this));
            },
            convert(index, rows){
                let id = rows[index].id;
                this.$http.jsonp("/app/point/use", {
                    params: {gift: id}
                }).then(function (res) {
                    let data = res.data;
                    Message({
                        showClose: true,
                        message: data.success ? "兑换成功" : data.message,
                        type: data.success ? "success" : "error"
                    });
                    if (data.success) {
                        this.init();
                    }
                }.bind(this));
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

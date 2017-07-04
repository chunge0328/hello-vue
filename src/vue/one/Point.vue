<style>
</style>
<template>
    <div class="bg-white bgwidth">
        <el-row>
            <el-col :span="12">&nbsp</el-col>
            <el-col :span="6">
                <header id="header" class="mui-bar mui-bar-nav">
                    <a class="mui-action-back mui-pull-left"></a>
                    <h1 class="mui-title">积分</h1>
                </header>
            </el-col>
        </el-row>

        <el-row :gutter="20" class="top10">
            <el-col :span="6"><b>我的总积分：</b></el-col>
            <el-col :span="12" class="fontTitleStyle"><b>{{myPoint}}&nbsp;分</b></el-col>
        </el-row>

        <el-row :gutter="20" class="top10">
            <el-col :span="6"><b>签到：</b></el-col>
            <el-col :span="16">
                <el-button type="primary" @click="sign()">签到</el-button>
            </el-col>
        </el-row>

        <el-row :gutter="20" class="top10">
            <el-col :span="6"><b>我的积分明细：</b></el-col>
        </el-row>

        <el-row :gutter="20" class="top10">
            <el-table :data="pointDetail" style="width: 100%">
                <el-table-column prop="fromName" label="来源" sortable>
                    <template scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.fromName == null?'-' : scope.row.fromName}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="giftName" label="消费" sortable>
                    <template scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.giftName == null?'-' : scope.row.giftName}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="point" label="积分"></el-table-column>
                <el-table-column prop="balance" label="余额"></el-table-column>
                <el-table-column prop="cdate" label="交易日期" sortable>
                    <template scope="scope">
                        <el-icon name="time"></el-icon>
                        <span style="margin-left: 10px">{{ scope.row.cdate }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="ctime" label="交易时间" sortable></el-table-column>
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
                            :total="pointDetaillength">
                    </el-pagination>
                </div>
            </div>
        </el-row>

        <el-row :gutter="20" class="top10">
            <el-col :span="6"><b>积分礼品</b></el-col>
        </el-row>
        <el-row :gutter="20" class="top10">
            <el-table :data="giftList" style="width: 100%">
                <el-table-column prop="name" label="礼品名称"></el-table-column>
                <el-table-column prop="conname" label="条件"></el-table-column>
                <el-table-column prop="remark" label="说明"></el-table-column>
                <el-table-column prop="point" label="需要积分"></el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button @click.native.prevent="convert(scope.$index, scope.row)" type="text" size="small">
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
    import router from '../../js/config/OneRouterConfig';
    import {Util} from '../../js/utils/ValidateUtils';
    import {Input, Button, Message, Row, Col, Select, Option, Table, TableColumn, Icon, Pagination} from "element-ui";
    Vue.use(Input);
    Vue.use(Button);
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Select);
    Vue.use(Option);
    Vue.use(Table);
    Vue.use(TableColumn);
    Vue.use(Icon);
    Vue.use(Pagination);

    export default {
        data(){
            return {
                Util: Util,
                labelPosition: 'left',
                giftList: null,
                pointDetail: null,
                pointDetaillength: null,
                page: 1,
                limit: 5,
                myPoint: '0'
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
                        this.getMyPointDetail();
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
                    this.init();
                }.bind(this));
            },
            getMyPointDetail(){/*获取我的积分明细*/
                this.$http.jsonp("/app/point/getMyPointDetail", {
                    params: {
                        page: this.page,
                        limit: this.limit,
                        sort: JSON.stringify([{"property": "cdate", "direction": "DESC"}, {
                            "property": "ctime",
                            "direction": "DESC"
                        }])
                    }
                }).then(function (res) {
                    this.pointDetail = res.data.items;
                    this.pointDetaillength = res.data.total;

                }.bind(this));
            },
            convert(index, row){
                let id = row.id;
                this.$http.jsonp("/app/point/use", {
                    params: {gift: id}
                }).then(function (res) {
                    let data = res.data;
                    Message({
                        showClose: true,
                        message: data.success ? "兑换成功" : data.message,
                        type: data.success ? "success" : "error"
                    });
                    this.init();
                }.bind(this));
            },
            handleSizeChange(val) {
                this.limit = val;
                this.getMyPointDetail();
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getMyPointDetail();
            }
        }
    }
</script>

<style>
</style>
<template>
    <div class="bg-white">

        <el-dialog title="" :visible.sync="createDialogShow"><!--新增功能-->
            <ac-modify :account="account" :dicts="dicts" :callback="handleCallback"></ac-modify>
        </el-dialog><!--新增功能...end-->

        <el-row style="margin-top: 30px;">
            <el-col :span="20" :offset="2"><!--内容展示-->
                <el-button type="primary" @click="handleCreateaccount">创建</el-button>
                <el-table
                        :data="accounts"
                        border
                        stripe
                        style="width: 100%">
                    <el-table-column
                            prop="username"
                            label="用户名"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="password"
                            label="密码"
                            sortable
                            width="180">
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            label="操作"
                            width="140">
                        <template scope="scope" v-if="modifyList[scope.$index].id">
                            <el-popover
                                    width="600"
                                    trigger="click">
                                <ac-modify v-if="modifyList[scope.$index]"
                                           placement="auto"
                                           :account="accounts[scope.$index]"
                                           :dicts="dicts"></ac-modify>
                                <el-button
                                        ref="db-md-pop"
                                        @click="handleModifyaccount(accounts[scope.$index], scope.$index, accounts)"
                                        type="text"
                                        size="small"
                                        slot="reference">
                                    修改
                                </el-button>
                            </el-popover>
                            <el-button
                                    @click.native.prevent="handleDeleteaccount(accounts[scope.$index], scope.$index, accounts)"
                                    type="text"
                                    size="small">
                                移除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col><!--内容展示...end-->
        </el-row>
    </div>
</template>

<script>
    require("element-ui/lib/theme-default/index.css");

    import Vue from "vue";
    import {
        Row,
        Col,
        Button,
        Message,
        Select,
        Option,
        Table,
        TableColumn,
        Autocomplete,
        Popover,
        Dialog,
        Loading,
        MessageBox
    }
        from "element-ui";
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Button);
    Vue.use(Select);
    Vue.use(Option);
    Vue.use(Table);
    Vue.use(TableColumn);
    Vue.use(Autocomplete);
    Vue.use(Popover);
    Vue.use(Dialog);

    let loadingInstance = Loading.service({
        fullscreen: true,
        text: "页面初始化中..."
    });

    import AcModify from "../../../js/components/cifm/account/Account";
    Vue.use(AcModify);

    let getBaseData = function () {
        return {
            username: "",
            password: "",
        };
    };
    export default {

        data(){
            return {
                modifyList: [],
                createDialogShow: false,
                accounts: [],
                account: getBaseData(),
                dicts: {},
                pageRequest: {
                    page: 0,
                    size: 20,
                    sort: "cDate,cTime"
                }
            }
        },
        watch: {},
        methods: {
            handleQueryaccount() {
                this.$http.post("/admin/cifm/account/findAllPage", this.pageRequest, {
                    headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},
                    emulateJSON: true,
                }).then(function (res) {
                    let data = res.data;
                    this.accounts = data.content;
                }.bind(this));
            },
            handleSaveaccount(){
                this.$http.post("/admin/cifm/account/save", this.account).then(function (res) {
                    let data = res.data;
                    Message({
                        message: data.msg,
                        type: data.success ? "success" : "warning"
                    });
                    if (data.success) {
                        this.handleQueryaccount();
                        this.createDialogShow = false;
                    }
                }.bind(this));
            },
            handleQueryParam() {
                this.$http.post("/admin/sys/dictionay/getBatch", ["CIFM_ACCOUNT.USERNAME", "CIFM_ACCOUNT.PASSWORD", "CIFM_ACCOUNT.TYPE"]).then(function (res) {
                    let data = res.data;
                    this.dicts = data.content[0];
                }.bind(this));
            },
            handleModifyaccount(db, ind, dbs){
                this.account = db;
                this.modifyList = this.accounts.map(function (obj, i) {
                    return this.modifyList[i] || ind == i;
                }.bind(this));
            },
            handleDeleteaccount(db, ind, dbs) {
                MessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post("/admin/cifm/account/delete", db).then(function (res) {
                        let data = res.data;
                        Message({
                            message: data.msg,
                            type: data.success ? "success" : "warning"
                        });
                        if (data.success) {
                            this.handleQueryaccount();
                        }
                    })
                }).catch(() => {
//                    MessageBox.alert('已取消删除');
                });
            },
            handleCreateaccount(){
                this.createDialogShow = true;
                this.account = getBaseData();
                this.accounts.push(this.account);
            },
            handleCallback(){
                this.handleQueryaccount();
                this.createDialogShow = false;
            }
        }, created() {
            this.handleQueryParam();
            this.handleQueryaccount();
        }, mounted(){
            setTimeout(function () {
                loadingInstance.close();
            }.bind(this), 500);
        }
    }
</script>

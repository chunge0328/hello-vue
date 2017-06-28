<style>
</style>
<template>
    <div class="bg-white">

        <el-dialog title="" :visible.sync="createDialogShow"><!--新增功能-->
            <sv-modify :svn="svn" :dicts="dicts" :callback="handleCallback"></sv-modify>
        </el-dialog><!--新增功能...end-->

        <el-row style="margin-top: 30px;">
            <el-col :span="20" :offset="2"><!--内容展示-->
                <el-button type="primary" @click="handleCreatesvn">创建</el-button>
                <el-table
                        :data="svns"
                        border
                        stripe
                        style="width: 100%">
                    <el-table-column
                            prop="url"
                            label="地址"
                            width="500">
                    </el-table-column>
                    <el-table-column
                            prop="ip"
                            label="ip"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="env"
                            label="环境"
                            sortable
                            width="180">
                    </el-table-column>
                    <el-table-column
                            label="账户"
                            width="200">
                        <template scope="scope">
                            <el-popover
                                    width="600"
                                    trigger="click">
                                <manager v-if="associateList[scope.$index]" :target="target"></manager>
                                <el-button
                                        @click="handleShowAccount(svns[scope.$index], scope.$index, svns)"
                                        type="text"
                                        size="small"
                                        slot="reference">
                                    查看明细
                                </el-button>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            label="操作"
                            width="140">
                        <template scope="scope" v-if="modifyList[scope.$index].id">
                            <el-popover
                                    width="600"
                                    trigger="click">
                                <sv-modify v-if="modifyList[scope.$index]"
                                           placement="auto"
                                           :svn="svns[scope.$index]"
                                           :dicts="dicts"></sv-modify>
                                <el-button
                                        ref="db-md-pop"
                                        @click="handleModifysvn(svns[scope.$index], scope.$index, svns)"
                                        type="text"
                                        size="small"
                                        slot="reference">
                                    修改
                                </el-button>
                            </el-popover>
                            <el-button
                                    @click.native.prevent="handleDeletesvn(svn[scope.$index], scope.$index, svns)"
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

    import SvModify from "../../../js/components/cifm/svn/Svn";
    import Manager from "../../../js/components/cifm/cifm/Manager";
    Vue.use(SvModify);
    Vue.use(Manager);

    let getBaseData = function () {
        return {
            url: "",
            env: "",
            ip: "",
        };
    };
    export default {

        data(){
            return {
                modifyList: [],
                createDialogShow: false,
                svns: [],
                svn: getBaseData(),
                dicts: {},
                pageRequest: {
                    page: 0,
                    size: 20,
                    sort: "cDate,cTime"
                },

                associateList: [],
                target: {
                    data: getBaseData(),
                    findUrl: "/admin/cifm/cifm/findBySv",
                    assoUrl: "/admin/cifm/cifm/associateAcSv",
                    cancUrl: "",
                }
            }
        },
        watch: {},
        methods: {
            handleQuerysvn() {
                this.$http.post("/admin/cifm/svn/findAllPage", this.pageRequest, {
                    headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},
                    emulateJSON: true,
                }).then(function (res) {
                    let data = res.data;
                    this.svns = data.content;
                }.bind(this));
            },
            handleSavesvn(){
                this.$http.post("/admin/cifm/svn/save", this.svn).then(function (res) {
                    let data = res.data;
                    Message({
                        message: data.msg,
                        type: data.success ? "success" : "warning"
                    });
                    if (data.success) {
                        this.handleQuerysvn();
                        this.createDialogShow = false;
                    }
                }.bind(this));
            },
            handleQueryParam() {
                this.$http.post("/admin/sys/dictionay/getBatch", ["CIFM_SVN.URL", "CIFM_SVN.IP"]).then(function (res) {
                    let data = res.data;
                    this.dicts = data.content[0];
                }.bind(this));
            },
            handleModifysvn(db, ind, dbs){
                this.svn = db;
                this.modifyList = this.svns.map(function (obj, i) {
                    return this.modifyList[i] || ind == i;
                }.bind(this));
            },
            handleDeletesvn(db, ind, dbs) {
                MessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post("/admin/cifm/svn/delete", db).then(function (res) {
                        let data = res.data;
                        Message({
                            message: data.msg,
                            type: data.success ? "success" : "warning"
                        });
                        if (data.success) {
                            this.handleQuerysvn();
                        }
                    })
                }).catch(() => {
//                    MessageBox.alert('已取消删除');
                });
            },
            handleCreatesvn(){
                this.createDialogShow = true;
                this.svn = getBaseData();
                this.svns.push(this.svn);
            },
            handleCallback(){
                this.handleQuerysvn();
                this.createDialogShow = false;
            },
            handleShowAccount(db, ind, dbs){
                this.database = db;
                this.associateList = this.svns.map(function (obj, i) {
                    return this.associateList[i] || ind == i;
                }.bind(this));
                this.target.data = db;
            },
        }, created() {
            this.handleQueryParam();
            this.handleQuerysvn();
        }, mounted(){
            setTimeout(function () {
                loadingInstance.close();
            }.bind(this), 500);
        }
    }
</script>

<style>
</style>
<template>
    <div class="bg-white">

        <el-dialog title="" :visible.sync="createWinVisible">
            <db-modify :database="database" :dicts="dicts" :callback="handleCallback"></db-modify>
        </el-dialog>

        <el-row style="margin-top: 30px;">
            <el-col :span="20" :offset="2">
                <el-button type="primary" @click="handleCreateDatabase">创建</el-button>
                <el-table
                        :data="databases"
                        border
                        stripe
                        style="width: 100%">
                    <el-table-column
                            prop="type"
                            label="数据库类型"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="ip"
                            label="ip"
                            sortable
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="port"
                            label="端口"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            prop="sid"
                            label="实例"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="env"
                            label="环境"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            prop="remark"
                            label="说明"
                            width="200">
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
                                        @click="handleShowAccount(databases[scope.$index], scope.$index, databases)"
                                        type="text"
                                        size="small"
                                        slot="reference">
                                    <el-tag type="gray">{{scope.row.username}}</el-tag>
                                    /
                                    <el-tag type="primary">{{scope.row.username}}</el-tag>
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
                                <db-modify v-if="modifyList[scope.$index]"
                                           placement="auto"
                                           :database="databases[scope.$index]"
                                           :dicts="dicts"></db-modify>
                                <el-button
                                        ref="db-md-pop"
                                        @click="modifyRow(databases[scope.$index], scope.$index, databases)"
                                        type="text"
                                        size="small"
                                        slot="reference">
                                    修改
                                </el-button>
                            </el-popover>
                            <el-button
                                    @click.native.prevent="deleteRow(databases[scope.$index], scope.$index, databases)"
                                    type="text"
                                    size="small">
                                移除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
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
        MessageBox,
        Badge,
        Tag
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
    Vue.use(Badge);
    Vue.use(Tag);

    let loadingInstance = Loading.service({
        fullscreen: true,
        text: "页面初始化中..."
    });

    import DbModify from "../../../js/components/cifm/database/Database";
    import Manager from "../../../js/components/cifm/cifm/Manager";
    Vue.use(DbModify);
    Vue.use(Manager);

    let getBaseData = function () {
        return {
            ip: "",
            port: "",
            sid: "",
            remark: "",
        };
    }
    export default {

        data(){
            return {
                createWinVisible: false,

                modifyList: [],
                associateList: [],

                databases: [],
                database: getBaseData(),
                dicts: {},

                pageRequest: {
                    page: 0,
                    size: 20,
                    sort: "cDate,cTime"
                },

                target: {
                    data: getBaseData(),
                    findUrl: "/admin/cifm/cifm/findByDb",
                    assoUrl: "/admin/cifm/cifm/associateAcDb",
                    cancUrl: "",
                }
            }
        },
        watch: {
            /*databases:{
             handler(curVal,oldVal){
             console.info(curVal)
             console.info(oldVal)
             },
             deep:true
             }*/
        },
        methods: {
            handleSaveDb(){
                this.database.env = this.env.code;
                this.database.type = this.dbType.code;
                this.$http.post("/admin/cifm/database/save", this.database).then(function (res) {
                    let data = res.data;
                    Message({
                        message: data.msg,
                        type: data.success ? "success" : "warning"
                    });
                    if (data.success) {
                        this.handleQueryDb();
                        this.createWinVisible = false;
                    }
                }.bind(this));
            },
            handleQueryParam() {
                this.$http.post("/admin/sys/dictionay/getBatch", ["CIFM_DATABASE.ENV", "CIFM_DATABASE.TYPE", "CIFM_DATABASE.IP", "CIFM_DATABASE.PORT", "CIFM_DATABASE.SID", "CIFM_DATABASE.REMARK"]).then(function (res) {
                    let data = res.data;
                    this.dicts = data.content[0];
                }.bind(this));
            },
            handleQueryDb() {
//                this.$http.post("/admin/cifm/database/findAllPage", this.pageRequest, {
                this.$http.post("/admin/cifm/cifm/findDatabase", this.pageRequest, {
                    /*body: {"type": "CIFM_DATABASE.ENV"},*/
//                    params: this.pageRequest,
                    headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},
                    emulateJSON: true,
                }).then(function (res) {
                    let data = res.data;
                    this.databases = data.content;
                }.bind(this));
            },
            handleShowAccount(db, ind, dbs){
                this.database = db;
                this.associateList = this.databases.map(function (obj, i) {
                    return this.associateList[i] || ind == i;
                }.bind(this));
                this.target.data = db;
            },
            modifyRow(db, ind, dbs){
                this.database = db;
                this.modifyList = this.databases.map(function (obj, i) {
                    return this.modifyList[i] || ind == i;
                }.bind(this));
            },
            deleteRow(db, ind, dbs) {
                MessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post("/admin/cifm/database/delete", db).then(function (res) {
                        let data = res.data;
                        Message({
                            message: data.msg,
                            type: data.success ? "success" : "warning"
                        });
                        if (data.success) {
                            this.handleQueryDb();
                        }
                    })
                }).catch(() => {
//                    MessageBox.alert('已取消删除');
                });
            },
            handleCreateDatabase(){
                this.createWinVisible = true;
                this.database = getBaseData();
                this.databases.push(this.database);
            },
            handleCallback(){
                this.handleQueryDb();
                this.createWinVisible = false;
            }
        }, created() {
            this.handleQueryParam();
            this.handleQueryDb();
        }, mounted(){
            setTimeout(function () {
                loadingInstance.close();
            }.bind(this), 500);
        }
    }
</script>

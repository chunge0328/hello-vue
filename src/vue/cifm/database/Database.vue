<style>
</style>
<template>
    <div class="bg-white">
        <el-button type="primary" @click="handleCreateDatabase">创建</el-button>

        <el-dialog title="" :visible.sync="dialogTableVisible">
            <db-modify :database="database" :dicts="dicts"></db-modify>
        </el-dialog>

        <el-row>
            <el-table
                    :data="databases"
                    border
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
                        fixed="right"
                        label="操作"
                        width="140">
                    <template scope="scope">
                        <el-popover
                                width="600"
                                trigger="click">
                            <db-modify v-if="modifyFlag" placement="left-end" :database="databases[scope.$index]"
                                       :dicts="dicts"></db-modify>
                            <el-button
                                    ref="db-md-pop"
                                    @click.native.prevent="modifyRow(scope.$index, databases)"
                                    type="text"
                                    size="small"
                                    slot="reference">
                                修改
                            </el-button>
                        </el-popover>
                        <!--<el-button
                                @click.native.prevent="deleteRow(scope.$index, databases)"
                                type="text"
                                size="small">
                            移除
                        </el-button>-->
                    </template>
                </el-table-column>

            </el-table>

        </el-row>
    </div>
</template>

<script>
    require("element-ui/lib/theme-default/index.css");

    import Vue from "vue";
    import {
        Row, Col, Button, Message, Select, Option, Table, TableColumn, Autocomplete, Popover, Dialog, Loading
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
        text:"页面初始化中..."
    });

    import DbModify from "../../../js/components/cifm/database/Database";
    Vue.use(DbModify);

    export default {

        data(){
            return {
                modifyFlag: false,
                dialogTableVisible: false,
                databases: [],
                database: {
                    ip: "10.169.4.33",
                    port: "5001",
                    sid: "dspdb",
                    remark: "机构版网上交易",
                },
                dicts: {},
                pageRequest: {
                    page: 0,
                    size: 20,
                    sort: "cDate,cTime"
                }
            }
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
                        this.dialogTableVisible = false;
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
                this.$http.post("/admin/cifm/database/findAllPage", this.pageRequest, {
                    /*body: {"type": "CIFM_DATABASE.ENV"},*/
//                    params: this.pageRequest,
                    headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},
                    emulateJSON: true,
                }).then(function (res) {
                    let data = res.data;
                    this.databases = data.content;
                }.bind(this));
            },
            modifyRow(ind, dbs){
                this.database = dbs[ind];
                if (!this.modifyFlag) this.modifyFlag = true;
            },
            deleteRow(ind, dbs) {
            },
            handleCreateDatabase() {
                this.dialogTableVisible = true;
                this.database = {
                    ip: "",
                    port: "",
                    sid: "",
                    remark: "",
                }
            }
        }, created() {
            this.handleQueryParam();
            this.handleQueryDb();
        }, mounted(){
            setTimeout(function () {
                if (!this.modifyFlag) this.modifyFlag = true;
            }.bind(this), 300);
            setTimeout(function () {
                loadingInstance.close();
            }.bind(this), 800);
        }
    }
</script>

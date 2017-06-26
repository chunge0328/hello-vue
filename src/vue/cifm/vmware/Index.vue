<style>
    .form-line {
        margin-top: 20px;
    }
</style>
<template>
    <div class="bg-white">

        <el-dialog title="" :visible.sync="createDialogShow"><!--新增功能-->
            <vm-modify :vmware="vmware" :dicts="dicts" :callback="handleCallback"></vm-modify>
        </el-dialog><!--新增功能...end-->

        <el-row class="form-line">
            <el-col :span="16" :offset="4">
                <el-alert
                        title="虚拟机信息："
                        type="info"
                        description="登录账号：uo712/uo712@CIFM\nip：10.163.130.50"
                        show-icon>
                </el-alert>
            </el-col>
        </el-row>

        <el-row style="margin-top: 30px;">
            <el-col :span="20" :offset="2"><!--内容展示-->
                <el-button type="primary" @click="handleCreatevmware">创建</el-button>
                <el-table
                        :data="vmwares"
                        border
                        stripe
                        style="width: 100%">
                    <el-table-column
                            prop="groupName"
                            label="组名"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="teamName"
                            label="队名"
                            sortable
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="hostName"
                            label="主机名"
                            sortable
                            width="180">
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
                            sortable
                            width="160">
                    </el-table-column>
                    <el-table-column
                            prop="remark"
                            label="备注"
                            sortable
                            width="410">
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
                                        @click="handleShowAccount(vmwares[scope.$index], scope.$index, vmwares)"
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
                        <template scope="scope">
                            <el-popover
                                    width="600"
                                    trigger="click">
                                <vm-modify v-if="modifyList[scope.$index]"
                                           placement="auto"
                                           :vmware="vmwares[scope.$index]"
                                           :dicts="dicts"></vm-modify>
                                <el-button
                                        ref="db-md-pop"
                                        @click="handleModifyvmware(vmwares[scope.$index], scope.$index, vmwares)"
                                        type="text"
                                        size="small"
                                        slot="reference">
                                    修改
                                </el-button>
                            </el-popover>
                            <el-button
                                    @click.native.prevent="handleDeletevmware(vmwares[scope.$index], scope.$index, vmwares)"
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
        MessageBox,
        Alert
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
    Vue.use(Alert);


    let loadingInstance = Loading.service({
        fullscreen: true,
        text: "页面初始化中..."
    });

    import VmModify from "../../../js/components/cifm/vmware/Vmware";
    Vue.use(VmModify);

    let getBaseData = function () {
        return {
            groupName: "",
            hostName: "",
            ip: "",
            port: "",
            remark: "",
            teamName: "",
        };
    };
    export default {

        data(){
            return {
                modifyList: [],
                createDialogShow: false,
                vmwares: [],
                vmware: getBaseData(),
                dicts: {},
                pageRequest: {
                    page: 0,
                    size: 20,
                    sort: "cDate,cTime"
                },

                associateList: [],
                target: {
                    data: getBaseData(),
                    findUrl: "/admin/cifm/cifm/findByVm",
                    assoUrl: "/admin/cifm/cifm/associateAcVm",
                    cancUrl: "",
                }
            }
        },
        watch: {},
        methods: {
            handleQueryvmware() {
                this.$http.post("/admin/cifm/vmware/findAllPage", this.pageRequest, {
                    headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},
                    emulateJSON: true,
                }).then(function (res) {
                    let data = res.data;
                    this.vmwares = data.content;
                }.bind(this));
            },
            handleSavevmware(){
                this.$http.post("/admin/cifm/vmware/save", this.vmware).then(function (res) {
                    let data = res.data;
                    Message({
                        message: data.msg,
                        type: data.success ? "success" : "warning"
                    });
                    if (data.success) {
                        this.handleQueryvmware();
                        this.createDialogShow = false;
                    }
                }.bind(this));
            },
            handleQueryParam() {
                this.$http.post("/admin/sys/dictionay/getBatch", ["CIFM_VMWARE.GROUP_NAME", "CIFM_VMWARE.TEAM_NAME", "CIFM_VMWARE.HOST_NAME", "CIFM_VMWARE.IP", "CIFM_VMWARE.PORT", "CIFM_VMWARE.REMARK"]).then(function (res) {
                    let data = res.data;
                    this.dicts = data.content[0];
                }.bind(this));
            },
            handleModifyvmware(db, ind, dbs){
                this.vmware = db;
                this.modifyList = this.vmwares.map(function (obj, i) {
                    return this.modifyList[i] || ind == i;
                }.bind(this));
            },
            handleDeletevmware(db, ind, dbs) {
                MessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post("/admin/cifm/vmware/delete", db).then(function (res) {
                        let data = res.data;
                        Message({
                            message: data.msg,
                            type: data.success ? "success" : "warning"
                        });
                        if (data.success) {
                            this.handleQueryvmware();
                        }
                    })
                }).catch(() => {
//                    MessageBox.alert('已取消删除');
                });
            },
            handleCreatevmware(){
                this.createDialogShow = true;
                this.vmware = getBaseData();
                this.vmwares.push(this.vmware);
            },
            handleCallback(){
                this.handleQueryvmware();
                this.createDialogShow = false;
            },
            handleShowAccount(db, ind, dbs){
                this.database = db;
                this.associateList = this.vmwares.map(function (obj, i) {
                    return this.associateList[i] || ind == i;
                }.bind(this));
                this.target.data = db;
            },
        }, created() {
            this.handleQueryParam();
            this.handleQueryvmware();
        }, mounted(){
            setTimeout(function () {
                loadingInstance.close();
            }.bind(this), 500);
        }
    }
</script>

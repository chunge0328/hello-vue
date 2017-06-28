<style>
</style>
<template>
    <div class="bg-white">

        <el-dialog title="" :visible.sync="createDialogShow"><!--新增功能-->
            <lk-modify :link="link" :dicts="dicts" :callback="handleCallback"></lk-modify>
        </el-dialog><!--新增功能...end-->

        <el-row style="margin-top: 30px;">
            <el-col :span="20" :offset="2"><!--内容展示-->
                <el-button type="primary" @click="handleCreatelink">创建</el-button>
                <el-table
                        :data="links"
                        border
                        stripe
                        style="width: 100%">
                    <el-table-column
                            prop="src"
                            label="资源地址"
                            width="400">
                    </el-table-column>
                    <el-table-column
                            prop="text"
                            label="内容"
                            sortable
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="remark"
                            label="备注"
                            sortable
                            width="800">
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            label="操作"
                            width="140">
                        <template scope="scope" v-if="modifyList[scope.$index].id">
                            <el-popover
                                    width="600"
                                    trigger="click">
                                <lk-modify v-if="modifyList[scope.$index]"
                                           placement="auto"
                                           :link="links[scope.$index]"
                                           :dicts="dicts"></lk-modify>
                                <el-button
                                        ref="db-md-pop"
                                        @click="handleModifylink(links[scope.$index], scope.$index, links)"
                                        type="text"
                                        size="small"
                                        slot="reference">
                                    修改
                                </el-button>
                            </el-popover>
                            <el-button
                                    @click.native.prevent="handleDeletelink(links[scope.$index], scope.$index, links)"
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

    import LkModify from "../../../js/components/cifm/link/Link";
    Vue.use(LkModify);

    let getBaseData = function () {
        return {
            src: "",
            text: "",
            remark: "",
        };
    };
    export default {

        data(){
            return {
                modifyList: [],
                createDialogShow: false,
                links: [],
                link: getBaseData(),
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
            handleQuerylink() {
                this.$http.post("/admin/cifm/link/findAllPage", this.pageRequest, {
                    headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},
                    emulateJSON: true,
                }).then(function (res) {
                    let data = res.data;
                    this.links = data.content;
                }.bind(this));
            },
            handleSavelink(){
                this.$http.post("/admin/cifm/link/save", this.link).then(function (res) {
                    let data = res.data;
                    Message({
                        message: data.msg,
                        type: data.success ? "success" : "warning"
                    });
                    if (data.success) {
                        this.handleQuerylink();
                        this.createDialogShow = false;
                    }
                }.bind(this));
            },
            handleQueryParam() {
                this.$http.post("/admin/sys/dictionay/getBatch", ["CIFM_LINK.SRC", "CIFM_LINK.TEXT"]).then(function (res) {
                    let data = res.data;
                    this.dicts = data.content[0];
                }.bind(this));
            },
            handleModifylink(db, ind, dbs){
                this.link = db;
                this.modifyList = this.links.map(function (obj, i) {
                    return this.modifyList[i] || ind == i;
                }.bind(this));
            },
            handleDeletelink(db, ind, dbs) {
                MessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post("/admin/cifm/link/delete", db).then(function (res) {
                        let data = res.data;
                        Message({
                            message: data.msg,
                            type: data.success ? "success" : "warning"
                        });
                        if (data.success) {
                            this.handleQuerylink();
                        }
                    })
                }).catch(() => {
//                    MessageBox.alert('已取消删除');
                });
            },
            handleCreatelink(){
                this.createDialogShow = true;
                this.link = getBaseData();
                this.links.push(this.link);
            },
            handleCallback(){
                this.handleQuerylink();
                this.createDialogShow = false;
            }
        }, created() {
            this.handleQueryParam();
            this.handleQuerylink();
        }, mounted(){
            setTimeout(function () {
                loadingInstance.close();
            }.bind(this), 500);
        }
    }
</script>

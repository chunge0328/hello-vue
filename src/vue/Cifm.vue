<style>
    .submit-btn{
        display: block;
        margin: 10px auto;
    }
</style>
<template>
    <div class="bg-white">
        <el-row>
            <el-row :gutter="20"><!--第1行参数-->
                <el-col :span="3">
                    <label>ip</label>
                </el-col>
                <el-col :span="9">
                    <el-autocomplete
                            v-model="database.ip"
                            param-key="packageName"
                            class="inline-input"
                            :fetch-suggestions="querySearch"
                            placeholder="请输入ip"
                            @select="handleSelect"
                    ></el-autocomplete>
                </el-col>

                <el-col :span="3">
                    <label>端口</label>
                </el-col>
                <el-col :span="9">
                    <el-autocomplete
                            v-model="database.port"
                            param-key="projectName"
                            class="inline-input"
                            :fetch-suggestions="querySearch"
                            placeholder="请输入端口"
                            @select="handleSelect"
                    ></el-autocomplete>
                </el-col>
            </el-row><!--第1行参数...end-->

            <el-row :gutter="20"><!--第2行参数-->
                <el-col :span="3">
                    <label>sid</label>
                </el-col>
                <el-col :span="9">
                    <el-autocomplete
                            v-model="database.sid"
                            param-key="moduleName"
                            class="inline-input"
                            :fetch-suggestions="querySearch"
                            placeholder="请输入sid"
                            @select="handleSelect"
                    ></el-autocomplete>
                </el-col>

                <el-col :span="3">
                    <label>说明</label>
                </el-col>
                <el-col :span="9">
                    <el-autocomplete
                            v-model="database.remark"
                            param-key="entityName"
                            class="inline-input"
                            :fetch-suggestions="querySearch"
                            placeholder="请输入说明"
                            @select="handleSelect"
                    ></el-autocomplete>
                </el-col>
            </el-row><!--第2行参数...end-->

            <el-row :gutter="20">
                <el-col :span="3">
                    <label>环境</label>
                </el-col>
                <el-col :span="9">
                    <el-select v-model="env.code" placeholder="请选择">
                        <el-option
                                v-for="item in envs"
                                :key="item.seq"
                                :label="item.value"
                                :value="item.code">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row>
                <el-button class="submit-btn" @click="handleSaveDb" type="success">保存</el-button>
            </el-row>
        </el-row>
        <el-row>
            <el-table
                    :data="databases"
                    border
                    style="width: 100%">
                <el-table-column
                        prop="ip"
                        label="ip"
                        sortable
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="port"
                        label="端口"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="sid"
                        label="实例">
                </el-table-column>
                <el-table-column
                        prop="env"
                        label="环境"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="remark"
                        label="说明"
                        width="130">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="140">
                    <template scope="scope">
                        <el-button
                                @click.native.prevent="modifyRow(scope.$index, databases)"
                                type="text"
                                size="small">
                            修改
                        </el-button>
                        <el-button
                                @click.native.prevent="deleteRow(scope.$index, databases)"
                                type="text"
                                size="small">
                            移除
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
    import {
        Row, Col, Button, Message, Select, Option, Table, TableColumn
    }
        from "element-ui";
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Button);
    Vue.use(Select);
    Vue.use(Option);
    Vue.use(Table);
    Vue.use(TableColumn);

    import Markdown from "../js/components/Markdown";
    import CodeUtils from "../js/components/CodeUtils";
    Vue.use(Markdown);
    Vue.use(CodeUtils);

    export default {

        data(){
            return {
                databases: [],
                database:{
                    ip: "10.169.4.33",
                    port: "5001",
                    sid: "dspdb",
                    remark: "机构版网上交易",
                },
                envs: [],
                env: {},
                pageRequest:{
                    page: 0,
                    size: 20,
                    sort: "cDate,cTime"
                }
            }
        },
        methods: {
            querySearch(queryString, cb){
                var params = [{value: "651158394@qq.com"}, {value: "m17717066234@aliyun.com"}], key = "value", results = [];
                params.map(function (param, index, arr) {
                    let val = param[key];
                    if (!queryString || !val || val.toLowerCase().indexOf(queryString.toLowerCase()) === 0) {
                        results.push({
                            value: val
                        });
                    }
                }.bind(this));
                cb(results);
            },
            handleSelect(){

            },
            handleSaveDb(){
                this.database.env = this.env.code;
                this.$http.post("/admin/cifm/database/save", this.database).then(function (res) {
                    let data = res.data;
                    Message({
                        message: data.msg,
                        type: data.success ? "success" : "warning"
                    });
                    if(data.success) {
                    }
                    /*Message({
                     message: data.msg
                     });*/
                }.bind(this));
            },
            handleQueryParam() {
                this.$http.post("/admin/sys/dictionay/get", {/*"type": "CIFM_DATABASE.ENV"*/}, {
                    /*body: {"type": "CIFM_DATABASE.ENV"},*/
                    params: {"type": "CIFM_DATABASE.ENV"},
                    headers: {"Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8"}
                }).then(function (res) {
                    let data = res.data;
                    this.envs = data.content;
                    if(this.envs && this.envs.length >0) this.env = this.envs[0];
                }.bind(this));
            },
            handleQueryDb() {
                this.$http.post("/admin/cifm/database/findAllPage", this.pageRequest, {
                    /*body: {"type": "CIFM_DATABASE.ENV"},*/
                    params: this.pageRequest,
                    headers: {"Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8"}
                }).then(function (res) {
                    let data = res.data;
                    this.databases = data.content;
                }.bind(this));
            },
            modifyRow(ind, dbs){
            },
            deleteRow(ind, dbs) {
            }
        }, created() {
            this.handleQueryParam();
            this.handleQueryDb();
        }
    }
</script>

<style>
    .submit-btn {
        display: block;
        margin: 10px auto;
    }

    .inline-input {
        width: 100%;
    }

    label.input-label {
        line-height: 30px !important;
    }

    .form-line {
        margin-top: 10px;
    }

    .oper-line {
        text-align: center;
        margin: 10px 0px;
        padding: 15px 10px;
    }

    .form-add {
        background-color: #deddbc;
        margin: 10px 0px;
    }
</style>
<template>
    <div style="padding: 0px !important;">

        <el-row>
            <el-col :span="12" v-for="(acco ,index) in assoAccounts" :key="'acco' + index">
                <label style="margin-right: 10px;">用户{{index+1}}：</label>
                <el-tag type="gray">{{acco.username}}</el-tag>
                /
                <el-tag type="primary">{{acco.password}}</el-tag>
                <el-button @click="handleUnAssoTarget(acco)" type="text">取消关联</el-button>
            </el-col>
        </el-row>

        <el-row v-show="!addAccountVisible" class="form-line">
            <el-row>
                <el-col :span="3">
                    <label class="input-label">请选择用户</label>
                </el-col>
                <el-col :span="9">
                    <el-select v-model="account" placeholder="请选择">
                        <el-option
                                v-for="item in accounts"
                                :key="item.id"
                                :label="item.username"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-col>

                <el-col :span="9">
                    <el-button @click="addAccountVisible = true" type="warning">新增</el-button>
                    <el-button @click="handleAssoTarget" type="success" v-show="account.id">关联</el-button>
                </el-col>
            </el-row>

            <el-row class="form-line" v-show="account.id">
                <label>用户名</label>
                <el-tag type="gray">{{account.username}}</el-tag>
                <label>密码</label>
                <el-tag type="primary">{{account.password}}</el-tag>
            </el-row>
        </el-row>

        <el-row class="form-add" v-show="addAccountVisible">

            <el-row :gutter="20" class="form-line"><!--参数行-->
                <el-col :span="3">
                    <label class="input-label">用户名</label>
                </el-col>
                <el-col :span="9">
                    <el-autocomplete
                            v-model="account.username"
                            ref="username"
                            param-key="username"
                            class="inline-input"
                            :fetch-suggestions="handleSuggest"
                            placeholder="请输入用户名"
                            @select="handleSelect"
                    ></el-autocomplete>
                </el-col>

                <el-col :span="3">
                    <label class="input-label">密码</label>
                </el-col>
                <el-col :span="9" @keyup.enter="handleEnter">
                    <el-autocomplete
                            v-model="account.password"
                            ref="password"
                            param-key="password"
                            class="inline-input"
                            :fetch-suggestions="handleSuggest"
                            placeholder="请输入密码"
                            @select="handleSelect"
                    ></el-autocomplete>
                </el-col>
            </el-row><!--参数行...end-->

            <el-row class="oper-line">
                <el-button @click="handleAssoTarget" type="success">关联</el-button>
                <el-button @click="addAccountVisible = false" type="default">关闭</el-button>
            </el-row>
        </el-row>
    </div>
</template>

<script>
    require("element-ui/lib/theme-default/index.css");

    import $ from "../../../js/utils/Util";
    import Vue from "vue";
    import {
        Row, Col, Button, Message, Select, Option, Table, TableColumn, Autocomplete, Input, Tag
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
    Vue.use(Input);
    Vue.use(Tag);

    let getBaseData = function () {
        return {
            username: "",
            password: "",
        };
    };

    export default {

        data(){
            return {
                assoAccounts: [],
                account: getBaseData(),
                dicts: [],
                cacheAccounts: [],
                accounts: [],

                pageRequest: {
                    page: 0,
                    size: 20,
                    sort: "cDate,cTime"
                },

                addAccountVisible: false
            }
        },
        props: ["target", "callback"],
        methods: {
            handleSuggest(queryString, cb) {/*input提示框查询数据公共方法*/
                let ref = $(event.target).closest("[param-key]").attr("param-key"), key = "CIFM_ACCOUNT." + ref.toUpperCase(), params = this.dicts[key], results = [];
                if (params) {
                    results = params.map(function (res, ind, arr) {
                        let val = res.value;
                        return {value: val};
                    }.bind(this));
                    results = params.filter(function (res, ind, arr) {
                        let val = res.value;
                        return !queryString || (val && val.toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
                    }.bind(this));
                }
                this.$refs[ref].highlightedIndex = 0;
                cb(results);
            },
            handleSelect(){
            },
            handleQueryDicts() {
                this.$http.post("/admin/sys/dictionay/getBatch", ["CIFM_ACCOUNT.USERNAME", "CIFM_ACCOUNT.PASSWORD"]).then(function (res) {
                    let data = res.data;
                    this.dicts = data.content[0];
                }.bind(this));
            },
            handleQueryAccounts() {
                this.$http.post("/admin/cifm/account/findAllPage", this.pageRequest
                ).then(function (res) {
                    let data = res.data;
                    this.cacheAccounts = data.content;
                    this.accounts = JSON.parse(JSON.stringify(this.cacheAccounts));
                    this.account = (this.accounts && this.accounts.length > 0) ? this.accounts[0] : getBaseData();
                    this.handleFileterAccos();
//                    console.info(JSON.stringify(this.accounts))
                }.bind(this));
            },
            handleAssoTarget() {
                let param = {target :JSON.parse(JSON.stringify(this.target.data))};
                param.account = this.account;
                this.assoTarget(param);
            },
            handleUnAssoTarget(account) {
                let param = {target :JSON.parse(JSON.stringify(this.target.data))};
                param.account = account;
                this.assoTarget(param);
            },
            assoTarget(param) {
                this.$http.post(this.target.assoUrl, param, {
                }).then(function (res) {
                    let data = res.data;
                    Message({
                        message: data.msg,
                        type: data.success ? "success" : "warning"
                    });
                    if(data.success) {
                        this.handleQueryAsso();
                    }
                }.bind(this));
            },
            handleQueryAsso() {
                let param = JSON.parse(JSON.stringify(this.target.data));
                this.$http.post(this.target.findUrl, param, {
                }).then(function (res) {
                    let data = res.data;
                    this.assoAccounts = data.content;
                    this.handleFileterAccos();
                }.bind(this));

            },
            handleFileterAccos() {
                if(this.cacheAccounts && this.assoAccounts) {
                    this.accounts = this.cacheAccounts.filter(function (acco, index) {
                        for(let i=0; i<this.assoAccounts.length; i++) {
                            let asAc = this.assoAccounts[i];
                            if(asAc.id === acco.id) {
                                return false;
                            }
                        }
                        return true;
                    }.bind(this));
                    this.account = (this.accounts && this.accounts.length > 0) ? this.accounts[0] : getBaseData();
//                    console.info("==================")
//                    console.info(this.accounts.length);
//                    console.info(JSON.stringify(this.accounts))
                }
            }
        }, created() {
            this.handleQueryDicts();
            this.handleQueryAccounts();
            this.handleQueryAsso();
//            console.info(JSON.stringify(this.target))
        },
        mounted() {
        }
    }
</script>

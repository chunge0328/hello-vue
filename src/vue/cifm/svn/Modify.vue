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
        margin-top: 10px;
    }
</style>
<template>
    <div class="bg-white">
        <el-row>

            <el-row :gutter="20" class="form-line"><!--参数行-->
                <el-col :span="3">
                    <label class="input-label">地址</label>
                </el-col>
                <el-col :span="9">
                    <el-autocomplete
                            v-model="svn.url"
                            ref="url"
                            param-key="url"
                            class="inline-input"
                            :fetch-suggestions="handleSuggest"
                            placeholder="请输入地址"
                            @select="handleSelect"
                    ></el-autocomplete>
                </el-col>

                <el-col :span="3">
                    <label class="input-label">ip</label>
                </el-col>
                <el-col :span="9">
                    <el-autocomplete
                            v-model="svn.ip"
                            ref="ip"
                            param-key="ip"
                            class="inline-input"
                            :fetch-suggestions="handleSuggest"
                            placeholder="请输入ip"
                            @select="handleSelect"
                    ></el-autocomplete>
                </el-col>
            </el-row><!--参数行...end-->

            <el-row :gutter="20" class="form-line"><!--参数行-->
                <el-col :span="3">
                    <label class="input-label">环境</label>
                </el-col>
                <el-col :span="9">
                    <el-autocomplete
                            v-model="svn.env"
                            ref="env"
                            param-key="env"
                            class="inline-input"
                            :fetch-suggestions="handleSuggest"
                            placeholder="请输入用户名"
                            @select="handleSelect"
                    ></el-autocomplete>
                </el-col>
            </el-row><!--参数行...end-->


            <el-row class="oper-line">
                <el-button class="submit-btn" @click="handleSaveDb" type="success">保存</el-button>
            </el-row>
        </el-row>

    </div>
</template>

<script>
    require("element-ui/lib/theme-default/index.css");

    import $ from "../../../js/utils/Util";
    import Vue from "vue";
    import {
        Row, Col, Button, Message, Select, Option, Table, TableColumn, Autocomplete
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


    export default {

        data(){
            return {
                env: {},
                dbType: {},
                pageRequest: {
                    page: 0,
                    size: 20,
                    sort: "cDate,cTime"
                }
            }
        },
        props: ["svn", "dicts", "callback"],
        methods: {
            handleSuggest(queryString, cb) {/*input提示框查询数据公共方法*/
                let ref = $(event.target).closest("[param-key]").attr("param-key"), key = "CIFM_SVN." + ref.toUpperCase(), params = this.dicts[key], results = [];
                if (params) {
                    results = params.map(function (res, ind, arr) {
                        let val = res.value;
                        return {value: val};
                    }.bind(this));
                    results = params.filter(function (res, ind, arr) {
                        let val = res.value;
                        return !queryString || (val && val.toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
                    }.bind(this));
                    this.$refs[ref].highlightedIndex = 0;
                }
                cb(results);
            },
            handleSelect(){
            },
            handleSaveDb(){
                this.$http.post("/admin/cifm/svn/save", this.svn).then(function (res) {
                    let data = res.data;
                    Message({
                        message: data.msg,
                        type: data.success ? "success" : "warning"
                    });
                    if (data.success) {
                        if (($.type(this.callback) == "function")) {
                            this.callback(data, res);
                        }
                    }
                }.bind(this));
            }
        }, created() {
        }
    }
</script>

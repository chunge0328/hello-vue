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
            <!--DatabaseName=FCPDB-->
            <el-row :gutter="20" class="form-line"><!--参数行-->
                <el-col :span="3">
                    <label class="input-label">环境</label>
                </el-col>
                <el-col :span="9">
                    <el-select v-model="env" placeholder="请选择环境">
                        <el-option
                                v-for="item in dicts['CIFM_DATABASE.ENV']"
                                :key="item.seq"
                                :label="item.value"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-col>

                <el-col :span="3">
                    <label class="input-label">类型</label>
                </el-col>
                <el-col :span="9">
                    <el-select v-model="dbType" placeholder="请选择类型">
                        <el-option
                                v-for="item in  dicts['CIFM_DATABASE.TYPE']"
                                :key="item.seq"
                                :label="item.value"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row><!--参数行...end-->

            <el-row :gutter="20" class="form-line"><!--参数行-->
                <el-col :span="3">
                    <label class="input-label">ip</label>
                </el-col>
                <el-col :span="9">
                    <el-autocomplete
                            v-model="database.ip"
                            param-key="ip"
                            class="inline-input"
                            :fetch-suggestions="handleSuggest"
                            placeholder="请输入ip"
                            @select="handleSelect"
                    ></el-autocomplete>
                </el-col>

                <el-col :span="3">
                    <label class="input-label">端口</label>
                </el-col>
                <el-col :span="9">
                    <el-autocomplete
                            v-model="database.port"
                            param-key="port"
                            class="inline-input"
                            :fetch-suggestions="handleSuggest"
                            placeholder="请输入端口"
                            @select="handleSelect"
                    ></el-autocomplete>
                </el-col>
            </el-row><!--参数行...end-->

            <el-row :gutter="20" class="form-line"><!--参数行-->
                <el-col :span="3">
                    <label class="input-label">sid</label>
                </el-col>
                <el-col :span="9">
                    <el-autocomplete
                            v-model="database.sid"
                            param-key="sid"
                            class="inline-input"
                            :fetch-suggestions="handleSuggest"
                            placeholder="请输入sid"
                            @select="handleSelect"
                    ></el-autocomplete>
                </el-col>

                <el-col :span="3">
                    <label class="input-label">说明</label>
                </el-col>
                <el-col :span="9">
                    <el-autocomplete
                            v-model="database.remark"
                            param-key="remark"
                            class="inline-input"
                            :fetch-suggestions="handleSuggest"
                            placeholder="请输入说明"
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
        props: ["database", "dicts"],
        methods: {
            handleSuggest(queryString, cb) {/*input提示框查询数据公共方法*/
                let key = "CIFM_DATABASE." + $(event.target).closest("[param-key]").attr("param-key").toUpperCase(), params = this.dicts[key], results = [];
                this.getValueList(results, "value", params);
                results = results.filter(function (res, ind, arr) {
                    let val = res.value;
                    return !queryString || (val && val.toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
                }.bind(this));
                cb(results);
            },
            /*distObj作用是根据value去重*/
            getValueList(results, key, params) {
                if (!results) results = [];
                if ($.type(key) === "string") key = key.split(".");
                let paramType = $.type(params);
                if (paramType === "array") {
                    params.map(function (obj, ind, arr) {
                        this.getValueList(results, key, obj);
                    }.bind(this));
                } else if (paramType === "object") {
                    if (key && key.length > 0) {
                        this.getValueList(results, key.splice(1), params[key[0]]);
                    }
                } else if (paramType === "string") {
                    if (params && results.indexOf(params) < 0) {
                        results.push({
                            value: params
                        });
                    }
                }
            },
            handleSelect(){
            },
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
                    }
                }.bind(this));
            }
        }, created() {
//            console.info(JSON.stringify(this.database))
//            console.info(JSON.stringify(this.dicts))
            this.env = this.dicts['CIFM_DATABASE.ENV'][0];
            this.dbType = this.dicts['CIFM_DATABASE.TYPE'][0];
        }
    }
</script>

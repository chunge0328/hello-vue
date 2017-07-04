<style type="text/css">
    .el-row {
        margin-bottom: 20px;
    }

    .param-section {
        border: 1px solid #eaeefb;
        border-radius: 4px;
        transition: .2s;
        padding: 20px;
    }

    .el-col {
        border-radius: 4px;
    }

    .el-col label {
        width: 100%;
        height: 100%;
        display: block;
        text-align: right;
        vertical-align: middle;
        line-height: 35px;
    }
</style>
<template>
    <div>
        <el-row :gutter="10"><!--参数区域-->
            <h3>场合</h3>
            <el-row class="param-section">
                <el-col v-for="(sample, index) in javaCodeParamSamples" :key="'btn-' + index"
                        :span="24/javaCodeParamSamples.length" style="text-align: center">
                    <el-button @click="setCodeParam(sample, index)"
                               :type="javaCodeParam == javaCodeParamSamples[index] ? 'info' : ''">
                        {{sample.type}}
                    </el-button>
                </el-col>
            </el-row>

            <h3>参数</h3>
            <el-row class="param-section">
                <el-row :gutter="20"><!--第1行参数-->
                    <el-col :span="3">
                        <label>包名</label>
                    </el-col>
                    <el-col :span="9">
                        <el-autocomplete
                                param-key="packageName"
                                class="inline-input"
                                v-model="javaCodeParam.packageName"
                                :fetch-suggestions="querySearch"
                                placeholder="请输入包名"
                                @select="handleSelect"
                        ></el-autocomplete>
                    </el-col>

                    <el-col :span="3">
                        <label>项目名</label>
                    </el-col>
                    <el-col :span="9">
                        <el-autocomplete
                                param-key="projectName"
                                class="inline-input"
                                v-model="javaCodeParam.projectName"
                                :fetch-suggestions="querySearch"
                                placeholder="请输入项目名"
                                @select="handleSelect"
                        ></el-autocomplete>
                    </el-col>
                </el-row><!--第1行参数...end-->

                <el-row :gutter="20"><!--第2行参数-->
                    <el-col :span="3">
                        <label>模块名</label>
                    </el-col>
                    <el-col :span="9">
                        <el-autocomplete
                                param-key="moduleName"
                                class="inline-input"
                                v-model="javaCodeParam.moduleName"
                                :fetch-suggestions="querySearch"
                                placeholder="请输入模块名"
                                @select="handleSelect"
                        ></el-autocomplete>
                    </el-col>

                    <el-col :span="3">
                        <label>实体类名</label>
                    </el-col>
                    <el-col :span="9">
                        <el-autocomplete
                                param-key="entityName"
                                class="inline-input"
                                v-model="javaCodeParam.entityName"
                                :fetch-suggestions="querySearch"
                                placeholder="请输入实体类名"
                                @select="handleSelect"
                        ></el-autocomplete>
                    </el-col>
                </el-row><!--第2行参数...end-->

                <hr>
                <el-row><!--entity参数-->
                    <el-row class="param-section">
                        <el-button style="padding: 2px;" @click="javaCodeParam.entityFields.push({type:'',name:''})"><i class="el-icon-plus"></i></el-button>域
                        <el-row :gutter="20" v-for="(entityField, index) in javaCodeParam.entityFields"
                                :key="'entity-' + index">
                            <el-col :span="3">
                                <label>类型</label>
                            </el-col>
                            <el-col :span="7">
                                <el-autocomplete
                                        param-key="entityType"
                                        class="inline-input"
                                        v-model="entityField.type"
                                        :fetch-suggestions="querySearch"
                                        placeholder="请输入域类型"
                                        @select="handleSelect"
                                ></el-autocomplete>
                            </el-col>

                            <el-col :span="3">
                                <label>名称</label>
                            </el-col>
                            <el-col :span="7">
                                <el-autocomplete
                                        param-key="entityFields.name"
                                        class="inline-input"
                                        v-model="entityField.name"
                                        :fetch-suggestions="querySearch"
                                        placeholder="请输入域名称"
                                        @select="handleSelect"
                                ></el-autocomplete>
                            </el-col>
                            <el-col :span="4">
                                <el-button @click="javaCodeParam.entityFields.splice(index, 1)">删除</el-button>
                            </el-col>
                        </el-row>

                    </el-row>
                </el-row><!--entity参数...end-->

                <el-row style="text-align: center">
                    <el-button @click="genJavaCode" type="success">生成代码</el-button>
                </el-row>
            </el-row>
        </el-row><!--参数区域...end-->

        <div v-for="(code, ind) in javaCode"><!--中间代码区域-->
            <div v-for="(sec, key) in code">
                <h3>{{key}}</h3>
                <pre v-for="(con, cou) in sec">{{con}}</pre>
            </div>
        </div><!--中间代码区域...end-->
    </div>
</template>

<script>
    import $ from "../../js/utils/Util";
    import Vue from "vue";
    import {
        Row, Col, Input, Autocomplete, Button, Message
    }
        from "element-ui";
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Input);
    Vue.use(Autocomplete);
    Vue.use(Button);

    export default {
        data(){
            return {
                javaCode: [],

                sapmlesCache: [],
                javaCodeParamSamples: [],
                javaCodeParam: {
                    "entityType": ["String", "Long"],
                    "entityFields": [
                        {
                            type: "String",
                            name: "name"
                        }
                    ],
                    "entityName": "",
                    "moduleName": "",
                    "packageName": "",
                    "projectName": "",
                    "sectionName": "",
                    "type": ""
                }
            }
        },
        props: ["code"],
        methods: {
            querySearch(queryString, cb, key) {/*input提示框查询数据公共方法*/
                var params = this.sapmlesCache, results = [], key = $(event.target).closest("[param-key]").attr("param-key");
                this.getValueList(results, key, params);
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
            loadAll() {/*加载javaCodeParam示例*/
                this.$http.post("/admin/study/javaCode/findSampleParam", {}).then(function (res) {
                    let data = res.data;
                    this.sapmlesCache = data.content;
                    this.javaCodeParamSamples = JSON.parse(JSON.stringify(this.sapmlesCache));
                    this.setCodeParam(this.javaCodeParamSamples[0], 0);
//                    this.genJavaCode();
                }.bind(this));
            },
            setCodeParam(sample, index){
                this.javaCodeParamSamples = JSON.parse(JSON.stringify(this.sapmlesCache));
                this.javaCodeParam = this.javaCodeParamSamples[index];
            },
            genJavaCode(){/*生成java代码*/
                if (!this.javaCodeParam.packageName || !this.javaCodeParam.projectName || !this.javaCodeParam.moduleName || !this.javaCodeParam.entityName) {
                    Message({
                        message: "参数不能为空"
                    });
                    return;
                }
                this.$http.post("/admin/study/javaCode/genJavaCode", this.javaCodeParam).then(function (res) {
                    let data = res.data;
                    this.javaCode = data.content;
                }.bind(this));
            },
            handleSelect(item) {
                console.log(item);
            }
        },
        created(){
            this.loadAll();
        }
    }
    ;
</script>
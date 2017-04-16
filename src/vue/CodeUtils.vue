<style type="text/css">
    .el-row {
        margin-bottom: 20px;
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
            <el-row :gutter="20">
                <el-col :span="3">
                    <label>包名</label>
                </el-col>
                <el-col :span="9">
                    <el-autocomplete
                            class="inline-input"
                            v-model="javaCodeParam.packageName"
                            :fetch-suggestions="findPakageName"
                            placeholder="请输入包名"
                            @select="handleSelect"
                    ></el-autocomplete>
                </el-col>

                <el-col :span="3">
                    <label>项目名</label>
                </el-col>
                <el-col :span="9">
                    <el-autocomplete
                            class="inline-input"
                            v-model="javaCodeParam.projectName"
                            :fetch-suggestions="findProjectName"
                            placeholder="请输入项目名"
                            @select="handleSelect"
                    ></el-autocomplete>
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="3">
                    <label>模块名</label>
                </el-col>
                <el-col :span="9">
                    <el-autocomplete
                            class="inline-input"
                            v-model="javaCodeParam.moduleName"
                            :fetch-suggestions="findModuleName"
                            placeholder="请输入模块名"
                            @select="handleSelect"
                    ></el-autocomplete>
                </el-col>

                <el-col :span="3">
                    <label>实体类名</label>
                </el-col>
                <el-col :span="9">
                    <el-autocomplete
                            class="inline-input"
                            v-model="javaCodeParam.entityName"
                            :fetch-suggestions="findEntityName"
                            placeholder="请输入实体类名"
                            @select="handleSelect"
                    ></el-autocomplete>
                </el-col>
            </el-row>

            <el-row>
                <el-col v-for="(sample, index) in javaCodeParamSamples" :key="'btn-' + index"
                        :span="24/javaCodeParamSamples.length" style="text-align: center">
                    <el-button @click="setCodeParam(sample, index)" :type="javaCodeParam == javaCodeParamSamples[index] ? 'info' : ''">
                        {{sample.type}}
                    </el-button>
                </el-col>
            </el-row>

            <el-row style="text-align: center">
                <el-button @click="genJavaCode" type="success">生成代码</el-button>
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
                var params = this.sapmlesCache, results = [];
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
            findPakageName(queryString, cb){/*包名的input提示框*/
                this.querySearch(queryString, cb, "packageName");
            },
            findProjectName(queryString, cb){/*包名的input提示框*/
                this.querySearch(queryString, cb, "projectName");
            },
            findModuleName(queryString, cb){/*包名的input提示框*/
                this.querySearch(queryString, cb, "moduleName");
            },
            findEntityName(queryString, cb){/*包名的input提示框*/
                this.querySearch(queryString, cb, "entityName");
            },
            loadAll() {/*加载javaCodeParam示例*/
                this.$http.post("/ma/study/javaCode/findSampleParam", {}).then(function (res) {
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
                if(!this.javaCodeParam.packageName || !this.javaCodeParam.projectName ||
                    !this.javaCodeParam.moduleName || !this.javaCodeParam.entityName){
                    Message({
                        message: "参数不能为空"
                    });
                    return;
                }
                this.$http.post("/ma/study/javaCode/genJavaCode", this.javaCodeParam).then(function (res) {
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
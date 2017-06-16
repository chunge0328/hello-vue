<style>
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

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #20a0ff;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
<template>
    <div class="bg-white">
        <el-row>
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
                <el-row :gutter="20">
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
                </el-row>

                <el-row class="param-section">
                    <el-button style="padding: 2px;" @click="javaCodeParam.entityFields.push({type:'',name:''})"><i
                            class="el-icon-plus"></i></el-button>
                    域
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
    </div>
</template>

<script>
    require("element-ui/lib/theme-default/index.css");

    import Vue from "vue";
    import {
        Row, Col, Menu, Submenu, MenuItemGroup, MenuItem, Tabs, TabPane, Button, Upload, Message
    }
        from "element-ui";
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Menu);
    Vue.use(Submenu);
    Vue.use(MenuItemGroup);
    Vue.use(MenuItem);
    Vue.use(Tabs);
    Vue.use(TabPane);
    Vue.use(Button);
    Vue.use(Upload);

    import Markdown from "../js/components/Markdown";
    import CodeUtils from "../js/components/CodeUtils";
    Vue.use(Markdown);
    Vue.use(CodeUtils);

    export default {

        data(){
            return {}
        },
        methods: {}, created() {
        }
    }
</script>

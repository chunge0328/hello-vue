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
1231231
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
            return {

            }
        },
        methods: {

        }, created() {
        }
    }
</script>

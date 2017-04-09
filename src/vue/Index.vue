<style>

</style>
<template>
    <div class="bg-white">
        <el-row class="tac">
            <el-col :span="24">
                <div class="line"></div>
                <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                    <el-menu-item index="1">处理中心</el-menu-item>
                    <el-submenu index="2">
                        <template slot="title">我的工作台</template>
                        <el-menu-item index="2-1">选项1</el-menu-item>
                        <el-menu-item index="2-2">选项2</el-menu-item>
                        <el-menu-item index="2-3">选项3</el-menu-item>
                    </el-submenu>
                    <el-menu-item index="3"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item>
                </el-menu>

            </el-col>
        </el-row>

        <el-row class="tac" :gutter="20">
            <el-col :span="8">
                <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
                    <el-submenu index="1">
                        <template slot="title"><i class="el-icon-message"></i>导航一</template>
                        <el-menu-item-group>
                            <template slot="title">分组一</template>
                            <el-menu-item index="1-1">选项1</el-menu-item>
                            <el-menu-item index="1-2">选项2</el-menu-item>
                        </el-menu-item-group>
                        <el-menu-item-group title="分组2">
                            <el-menu-item index="1-3">选项3</el-menu-item>
                        </el-menu-item-group>
                        <el-submenu index="1-4">
                            <template slot="title">选项4</template>
                            <el-menu-item index="1-4-1">选项1</el-menu-item>
                        </el-submenu>
                    </el-submenu>
                    <el-menu-item index="2"><i class="el-icon-menu"></i>导航二</el-menu-item>
                    <el-menu-item index="3"><i class="el-icon-setting"></i>导航三</el-menu-item>
                </el-menu>
            </el-col>

            <el-col :span="16">
                <markdown :markdown="markdown"></markdown>
            </el-col>

        </el-row>
    </div>
</template>


<script>
    require("Css/index.css");
    require("element-ui/lib/theme-default/index.css");

    import Vue from "vue";
    import {
        Row, Col, Menu, Submenu, MenuItemGroup, MenuItem
    }
        from "element-ui";
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Menu);
    Vue.use(Submenu);
    Vue.use(MenuItemGroup);
    Vue.use(MenuItem);


    Vue.use(require("Js/components/Markdown").default)

    import Markdown from "Vue/Markdown.vue";

    export default {

        data(){
            return {
                activeIndex: '1',
                activeIndex2: '1',
                activeName2: 'first',
                markdown: ""
            }
        },
        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            },
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClick(tab, event) {
                console.log(tab, event);
            }
        }, created() {
            this.$http.get("/readme.md", {params: {}}).then(function (res) {
                this.markdown = res.data;
            }.bind(this));
        }
    }
</script>

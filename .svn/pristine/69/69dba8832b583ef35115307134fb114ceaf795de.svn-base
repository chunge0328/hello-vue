<style>
</style>
<template>
    <div class="bg-white">
        <el-menu theme="dark" :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
                 @select="handleSelect">
            <el-menu-item index="1">处理中心</el-menu-item>
            <!--<el-submenu index="2">
                <template slot="title">我的工作台</template>
                <el-menu-item index="2-1">选项1</el-menu-item>
                <el-menu-item index="2-2">选项2</el-menu-item>
                <el-menu-item index="2-3">选项3</el-menu-item>
            </el-submenu>-->
        </el-menu>
        <div class="line"></div>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="数据库" name="first">
                <database v-if="activeTabs[0]"></database>
            </el-tab-pane>
            <el-tab-pane label="虚拟机" name="second">
                <pch-vmware v-if="activeTabs[1]"></pch-vmware>
            </el-tab-pane>
            <el-tab-pane label="svn" name="third">
                <pch-svn v-if="activeTabs[2]"></pch-svn>
            </el-tab-pane>
            <el-tab-pane label="链接" name="fourth">
                <pch-link v-if="activeTabs[3]"></pch-link>
            </el-tab-pane>
            <el-tab-pane label="账户" name="five">
                <account v-if="activeTabs[4]"></account>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    require("element-ui/lib/theme-default/index.css");

    import Vue from "vue";
    import Database from "../js/components/cifm/database/Database";
    Vue.use(Database);
    import Account from "../js/components/cifm/account/Account";
    Vue.use(Account);
    import PchLink from "../js/components/cifm/link/Link";
    Vue.use(PchLink);
    import PchSvn from "../js/components/cifm/svn/Svn";
    Vue.use(PchSvn);
    import PchVmware from "../js/components/cifm/vmware/Vmware";
    Vue.use(PchVmware);


    import {
        Menu,
        Submenu,
        MenuItem,
        Tabs,
        TabPane,
    }
        from "element-ui";
    Vue.use(Menu);
    Vue.use(Submenu);
    Vue.use(MenuItem);
    Vue.use(Tabs);
    Vue.use(TabPane);

    export default {

        data(){
            return {
                activeIndex: '1',
                activeName: 'first',
                activeTabs:[true]
            };
        },
        methods: {
            handleSelect(key, keyPath) {
                location.href = "";
            },
            handleClick(tab, event) {
                let index = tab.index;
                if(!this.activeTabs[index]) this.activeTabs[index] = true;
            }
        }, created() {
        }
    }
</script>

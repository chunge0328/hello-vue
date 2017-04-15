<style>

</style>
<template>
    <div class="bg-white">

        <section class="page-header">
            <h1 class="project-name">hello-vue</h1>
            <h2 class="project-tagline"></h2>
            <a href="https://github.com/17717066234/hello-vue" class="btn">View on GitHub</a>
        </section>

        <el-row class="page-nav">
            <el-col :span="24">
                <div class="line"></div>
                <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                    <el-menu-item index="1">首页</el-menu-item>
                    <el-submenu index="2">
                        <template slot="title">前台</template>
                        <el-menu-item index="2-1">选项1</el-menu-item>
                        <el-menu-item index="2-2">选项2</el-menu-item>
                        <el-menu-item index="2-3">选项3</el-menu-item>
                    </el-submenu>
                    <el-menu-item index="3"><a href="https://www.ele.me" target="_blank">后台管理</a></el-menu-item>
                </el-menu>

            </el-col>
        </el-row>

        <el-row :gutter="80">
            <el-col :span="5" class="page-left">
                <el-menu default-active="2" class="el-menu-vertical" @open="handleOpen" @close="handleClose">
                    <el-submenu index="1">
                        <template slot="title"><i class="el-icon-message"></i>文档</template>
                        <el-menu-item-group v-if="docs.length>0">
                            <template slot="title">markdown</template>
                            <el-menu-item v-for="(dat, ind) in docs" :index="'1-'+ind" :key="'1-'+ind"
                                          @click="switchMd(dat, ind)">{{dat}}
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-menu-item @click="menuIndex=2" index="2"><i class="el-icon-menu"></i>开发工具</el-menu-item>
                    <el-menu-item index="3" @click="window.location.href='https://www.baidu.com'"><i
                            class="el-icon-setting"></i>百度
                    </el-menu-item>
                </el-menu>
            </el-col>

            <el-col :span="19">


                <el-tabs v-show="1==menuIndex" v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit">
                    <el-tab-pane
                            v-for="(item, index) in editableTabs"
                            :label="item.title"
                            :name="item.name"
                            :key="'tab-1-'+index"
                    >
                        <markdown :markdown="item.content"></markdown>
                    </el-tab-pane>
                </el-tabs>

                <code-utils v-show="2==menuIndex"></code-utils>
            </el-col>

        </el-row>
    </div>
</template>


<script>
    require("../css/index.css");
    require("element-ui/lib/theme-default/index.css");

    import Vue from "vue";
    import {
        Row, Col, Menu, Submenu, MenuItemGroup, MenuItem, Tabs, TabPane
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

    import Markdown from "../js/components/Markdown";
    import CodeUtils from "../js/components/CodeUtils";
    Vue.use(Markdown);
    Vue.use(CodeUtils);

    export default {

        data(){
            return {
                menuIndex: 1,

                activeIndex: '1',
                activeIndex2: '1',
                activeName2: 'first',
                mds: [],
                activeMd: {},
                docs: ["readme.md"],
                json: {key: "value"},
                rootPath: "/resources/md/",

                editableTabsValue: '1',
                editableTabs: [],
                tabIndex: 1
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
            handleClick(e) {
                alert();
                this.menuIndex = 1;
            },
            handleTabsEdit(targetName, action) {
                if (action === 'add') {
                    let newTabName = ++this.tabIndex + '';
                    this.editableTabs.push({
                        title: 'New Tab',
                        name: newTabName,
                        content: 'New Tab content'
                    });
                    this.editableTabsValue = newTabName;
                }
                if (action === 'remove') {
                    let tabs = this.editableTabs;
                    let activeName = this.editableTabsValue;
                    if (activeName === targetName) {
                        tabs.forEach((tab, index) => {
                            if (tab.name === targetName) {
                                let nextTab = tabs[index + 1] || tabs[index - 1];
                                if (nextTab) {
                                    activeName = nextTab.name;
                                }
                            }
                        });
                    }

                    this.editableTabsValue = activeName;
                    this.editableTabs = tabs.filter(tab => tab.name !== targetName);
                }
            },
            addTab(key, val){
                this.editableTabs.push({
                    title: key,
                    name: String(this.mds.length),
                    content: val
                });
                this.editableTabsValue = String(this.editableTabs.length);
            },
            switchMd(dat, ind) {
                this.menuIndex = 1;
                let mds = this.mds;
                for (let i = 0; i < mds.length; i++) {
                    let md = mds[i];
                    for (let j in md) {
                        if (j === dat) {
                            this.activeMd = md;
                            this.editableTabsValue = String(i + 1);
                            return true;
                        }
                    }
                }
                this.$http.get(this.rootPath + dat, {params: {}}).then(function (res) {
                    let obj = {};
                    obj[dat] = res.data;
                    this.activeMd = obj;
                    this.mds.push(obj);
                    this.addTab(dat, obj[dat]);
                }.bind(this));
            }
        }, created() {
            let defultDoc = this.docs[0];
            this.$http.get(process.env.PAGE_PATH + "/" + defultDoc, {params: {}}).then(function (res) {
                let obj = {};
                obj[defultDoc] = res.data;
                this.activeMd = obj;
                this.mds.push(obj);
                this.addTab(defultDoc, obj[defultDoc]);
            }.bind(this));
            this.$http.get(process.env.PAGE_PATH + this.rootPath, {params: {}}).then(function (res) {
                this.docs = this.docs.concat(res.data);
            }.bind(this));
        }
    }
</script>

<style>

</style>
<template>
    <div class="bg-white">

        <section class="page-header"><!--页面头部-->
            <h1 class="project-name">hello-vue</h1>
            <h2 class="project-tagline"></h2>
            <a href="https://github.com/17717066234/hello-vue" class="btn">View on GitHub</a>
        </section><!--页面头部...end-->

        <el-row class="page-nav"><!--页面头部导航-->
            <el-col :span="24">
                <div class="line"></div>
                <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                    <el-menu-item index="1">首页</el-menu-item>
                    <el-submenu index="2">
                        <template slot="title">前台</template>
                        <el-menu-item index="2-1">选项1</el-menu-item>
                        <el-menu-item index="2-2">选项2</el-menu-item>
                        <el-menu-item index="2-3">选项3</el-menu-item>
                    </el-submenu>
                    <el-menu-item index="3">
                        <a href="http://www.baismusic.com:8080/panchaohui/swagger-ui.html" target="_blank">后台管理</a>
                    </el-menu-item>
                </el-menu>
            </el-col>
        </el-row><!--页面头部导航...end-->

        <el-row :gutter="80"><!--页面正文部分-->
            <el-col :span="5" class="page-left"><!--页面左侧菜单-->
                <el-menu default-active="1-0" class="el-menu-vertical" @open="handleOpen" @close="handleClose">
                    <el-submenu index="1">
                        <template slot="title"><i class="el-icon-message"></i>文档</template>
                        <el-menu-item-group v-if="markdowns.length>0">
                            <template slot="title">markdown</template>
                            <el-menu-item v-for="(markdown, index) in markdowns"
                                          :index="'1-'+index" :key="'1-'+index"
                                          @click="switchMarkdown(markdown, index)">{{markdown.name}}
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-menu-item index="2" @click="menuIndex=2"><i class="el-icon-menu"></i>开发工具</el-menu-item>
                    <el-menu-item index="3" @click="window.location.href='https://www.baidu.com'"><i
                            class="el-icon-setting"></i>百度
                    </el-menu-item>
                </el-menu>
            </el-col><!--页面左侧菜单...end-->

            <el-col :span="19"><!--页面中间内容-->
                <el-tabs v-show="1==menuIndex && markdowns.length > 0" v-model="tabIndex" type="card" editable
                         @edit="handleTabsEdit">
                    <el-tab-pane
                            v-for="(markdown, index) in markdowns"
                            :label="markdown.name"
                            :name="markdown.name"
                            :key="'tab-1-'+index"
                            v-if="markdown.show"
                            @click="switchMarkdown(markdown, index)"
                    >
                        <markdown :markdown="markdown" :setMarkdown="setMarkdown"></markdown>
                    </el-tab-pane>
                </el-tabs>

                <code-utils v-show="2==menuIndex"></code-utils>
            </el-col><!--页面中间内容...end-->

        </el-row><!--页面正文部分...end-->
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
                activeName2: 'first',

                markdowns: [{
                    name: "readme.md",
                    requestPath: process.env.PAGE_PATH + "/readme.md",
                    content: "",
                    show: false
                }],
                activeMarkdown: {},
                tabIndex: "",

                markdownRootPath: process.env.PAGE_PATH + "/resources/md/"
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
                this.menuIndex = 1;
            },
            handleTabsEdit(targetName, action) {/*新增或者关闭tab页*/
                if (action === 'add') {
                    let tabName = "new Tab" + this.markdowns.length;
                    this.markdowns.push({
                        name: tabName,
                        content: "",
                        show: true
                    });
                    this.activeMarkdown = this.markdowns[this.markdowns.length - 1];
                    this.tabIndex = tabName;
                }
                if (action === 'remove') {
                    let tabs = this.markdowns, prevTab = null, nextTab = null, findTarget = false;
                    this.markdowns = tabs.filter(function (markdown, index, markdowns) {
                        if (targetName === markdown.name) {
                            findTarget = true;
                            if (!markdown.requestPath) {
                                return false;
                            }
                            markdown.show = false;
                        } else {
                            if (markdown.show) {
                                if (!findTarget) prevTab = markdown;
                                else if (!nextTab) nextTab = markdown;
                            }
                        }
                        return true;
                    }.bind(this));
                    if (nextTab || prevTab)
                        this.tabIndex = nextTab ? nextTab.name : prevTab.name;
                }
            },
            setMarkdown(curVal, oldVal){/*markdown组件的回调函数*/
                this.activeMarkdown.content = curVal;
            },
            showMarkdownTab(markdown) {/*是否展示markdown的tab页面*/
                if (markdown.content || !markdown.requestPath) {
                    return true;
                }
                return false;
            },
            switchMarkdown(markdown, index) {/*切换markdown*/
                this.menuIndex = 1;
                this.activeMarkdown = markdown;
                this.tabIndex = markdown.name;
                if (!this.activeMarkdown.content && this.activeMarkdown.requestPath) {
                    this.$http.get(markdown.requestPath, {}).then(function (res) {
                        markdown.content = res.data;
                        markdown.show = true;
                        this.markdowns.splice(this.markdowns.length);
                        if (!markdown.content) markdown.content = "no response data";
                    }.bind(this));
                } else {
                    markdown.show = true;
                }
            },
            loadMarkdownOptions(){/*初始化markdown列表*/
                let rootPath = this.markdownRootPath;
                this.$http.get(this.markdownRootPath, {}).then(function (res) {
                    let data = res.data;
                    if (Object.prototype.toString.call(data) === "[object Array]") {

                    } else {
                        console.info(data);
                        data = this.regHtmlToArr(data);
                    }
                    let arr = data.map(function (dat, ind, arr) {
                        return {
                            name: dat,
                            requestPath: rootPath + dat
                        }
                    });
                    this.markdowns = this.markdowns.concat(arr);
                }.bind(this));
            },
            regHtmlToArr(html){
                let reg = /<a\s+?href=\"([^\"]+?)\"/ig,
                    r,
                    arr = [];
                while (r = reg.exec(html)) {
                    if(r[1] !== '../' && r[1] !== './')
                    arr.push(r[1])
                }
                return arr;
            }
        }, created() {
            this.loadMarkdownOptions();
            this.switchMarkdown(this.markdowns[0], 0);
        }
    }
</script>

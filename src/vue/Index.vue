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
                            <el-menu-item v-for="(dat, ind) in docs" :index="'1-'+ind" :key="'1-'+ind" @click="switchMd(dat, ind)">{{dat}}</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-menu-item index="2"><i class="el-icon-menu"></i>没想好二</el-menu-item>
                    <el-menu-item index="3"><i class="el-icon-setting"></i>没想好三</el-menu-item>
                </el-menu>
            </el-col>

            <el-col :span="19">

                <div v-for="(dat, ind) in mds">
                    <div v-for="(d, i) in dat">
                        <!--<h3>{{i}}</h3>-->
                        <markdown :markdown="d" v-show="activeMd == dat"></markdown>
                    </div>
                </div>
            </el-col>

        </el-row>
    </div>
</template>


<script>
    require("../css/index.css");
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


    Vue.use(require("../js/components/Markdown").default)

    import Markdown from "Vue/Markdown.vue";

    export default {

        data(){
            return {
                activeIndex: '1',
                activeIndex2: '1',
                activeName2: 'first',
                mds: [],
                activeMd: {},
                docs: ["readme.md"],
                json:{key:"value"},
                rootPath: "/resources/md/"
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
            },
            switchMd(dat, ind) {
                let mds = this.mds;
                for(let i=0; i<mds.length; i++) {
                    let md = mds[i];
                    for(let j in md) {
                        if(j === dat) {
                            this.activeMd = md;
                            return true;
                        }
                    }
                }
                this.$http.get(this.rootPath + dat, {params: {}}).then(function (res) {
                    let obj = {};
                    obj[dat] = res.data;
                    this.activeMd = obj;
                    this.mds.push(obj);
                }.bind(this));
            }
        }, created() {
            let defultDoc = this.docs[0];
            this.$http.get("/"+defultDoc, {params: {}}).then(function (res) {
                let obj = {};
                obj[defultDoc] = res.data;
                this.activeMd = obj;
                this.mds.push(obj);
            }.bind(this));
            this.$http.get(this.rootPath, {params: {}}).then(function (res) {
                this.docs = this.docs.concat(res.data);
            }.bind(this));
        }
    }
</script>

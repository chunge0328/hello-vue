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
                        <template slot="title">资料库</template>
                        <el-menu-item index="2-1"><a href="/resources/mj2html/hello-world.html">后台架构</a></el-menu-item>
                        <el-menu-item index="2-2"><a href="/resources/mj2html/基金从业资格.html">基金从业资格资料</a></el-menu-item>
                    </el-submenu>
                    <el-menu-item index="3">
                        <a href="http://www.baismusic.com:8080/panchaohui/swagger-ui.html" target="_blank">后台管理</a>
                    </el-menu-item>
                </el-menu>
            </el-col>
        </el-row><!--页面头部导航...end-->

        <el-row :gutter="80"><!--页面正文部分-->
            <el-col :span="5" class="page-left"><!--页面左侧菜单-->
                <!--default-active="1-0"-->
                <el-menu :default-active="defaultActiveMenu" class="el-menu-vertical" @open="handleOpen"
                         @close="handleClose">
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
                    <el-menu-item index="3" @click="menuIndex=3"><i class="el-icon-message"></i>发送邮件</el-menu-item>
                    <el-menu-item index="4" @click="menuIndex=4"><i class="el-icon-message"></i>文件管理</el-menu-item>
                    <el-menu-item index="5">
                        <i class="el-icon-setting"></i><a href="https://www.baidu.com" target="_blank">百度</a>
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

                <div v-show="3==menuIndex">
                    <el-row :gutter="20">
                        <markdown :markdown="mailMarkdown" :setMarkdown="setMailHtml"></markdown>
                        <el-col :span="4">
                            <label>邮件地址</label>
                        </el-col>
                        <el-col :span="8">
                            <el-autocomplete
                                    class="inline-input"
                                    v-model="javaMailParam.to"
                                    :fetch-suggestions="findMailToName"
                                    placeholder="请输入邮件地址"
                            ></el-autocomplete>
                        </el-col>

                        <el-col :span="4">
                            <label>邮件标题</label>
                        </el-col>
                        <el-col :span="8">
                            <el-autocomplete
                                    class="inline-input"
                                    v-model="javaMailParam.subject"
                                    :fetch-suggestions="findMailSubjectName"
                                    placeholder="请输入邮件标题"
                            ></el-autocomplete>
                        </el-col>
                    </el-row>

                    <el-row style="text-align: center">
                        <el-button @click="sendMail" type="success" :disabled="!mailSendState">{{mailBtnText}}
                        </el-button>
                    </el-row>
                </div>
                <div v-show="4==menuIndex">
                    <el-upload
                            class="avatar-uploader"
                            :action=fileUploadUrl
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="fileUrl" src="fileUrl" alt="">
                        <a v-if="fileUrl" :href="fileUrl" class="avatar"></a>
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </div>
            </el-col><!--页面中间内容...end-->
        </el-row><!--页面正文部分...end-->
        <div class="footer">
            <div class="footer-center"><span>备案号</span><a href="http://www.miitbeian.gov.cn/" target="_blank"><span>苏ICP备17002628号</span></a></div>
        </div>
    </div>
</template>

<script>
    require("../css/index.css");
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
                menuIndex: 1,
                defaultActiveMenu: 1,

                activeIndex: '1',
                activeName2: 'first',

                markdowns: [{
                    name: "readme.md",
                    requestPath: process.env.PAGE_PATH + "/readme.md?r=" + Math.random(),
                    content: "",
                    show: false
                }],
                activeMarkdown: {},
                tabIndex: "",

                markdownRootPath: process.env.PAGE_PATH + "/resources/md/",

                mailMarkdown: {
                    css: "",
                    content: "## 测试邮件 ##\n![](https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1492446415573&di=af4599d3484ea5845088d6628389ae40&imgtype=0&src=http%3A%2F%2Fatt.x2.hiapk.com%2Fforum%2F201411%2F02%2F190602guilwcc65uglw6uw.jpg)\n\n\t这是由markdown转译的邮件",
                    html: ""
                },
                markdownCssPath: process.env.PAGE_PATH + "/resources/css/markdown.css?r=" + Math.random(),
                javaMailParam: {
                    subject: "",
                    text: "",
                    to: ""
                },
                mailSendState: true,
                mailBtnText: "发送邮件",

                /*menu-4*/
                fileUrl: "",
                fileUploadUrl: process.env.BASE_PATH + "/open/home/upload"
                /*menu-4...end*/
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
            setMailHtml(curVal, oldVal, html) {/*markdown组件的回调函数*/
                this.mailMarkdown.html = html;
            },
            sendMail(){/*发送邮件*/
                this.javaMailParam.text = this.mailMarkdown.css + this.mailMarkdown.html;
                if (this.mailSendState) {
                    this.disableMailSend(3);
                    this.$http.post("/oauth/message/sendMail", this.javaMailParam).then(function (res) {
                        let data = res.data;
                        Message({
                            message: data.msg,
                            type: data.success ? "success" : "warning"
                        })
                        /*Message({
                         message: data.msg
                         });*/
                    }.bind(this));

                }
            },
            disableMailSend(count){
                if (count > 0) {
                    this.mailSendState = false;
                    this.mailBtnText = "剩余 " + count-- + " 秒";
                    setTimeout(function () {
                        this.disableMailSend.call(this, count);
                    }.bind(this), 1 * 1000);
                } else {
                    this.mailSendState = true;
                    this.mailBtnText = "发送邮件";
                }

            },
            loadMailCss(){
                this.$http.get(this.markdownCssPath, {}).then(function (res) {
                    this.mailMarkdown.css = "<style type=\"text/css\">\n" + res.data + "\n</style>\n";
                }.bind(this));

            },
            findMailToName(queryString, cb){
                var params = [{value: "651158394@qq.com"}, {value: "m17717066234@aliyun.com"}], key = "value", results = [];
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
            findMailSubjectName(queryString, cb) {
                var params = [{value: "标题"}, {value: "上午好"}], key = "value", results = [];
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
                    this.$http.get(markdown.requestPath  + "?r=" + Math.random(), {}).then(function (res) {
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
                    if (r[1] !== '../' && r[1] !== './')
                        arr.push(r[1])
                }
                return arr;
            },

            /*menu-4*/
            handleAvatarSuccess(res, file) {
                console.info(res);
//                this.fileUrl = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                /*const isJPG = file.type === 'image/jpeg';
                 const isLt2M = file.size / 1024 / 1024 < 2;

                 if (!isJPG) {
                 this.$message.error('上传头像图片只能是 JPG 格式!');
                 }
                 if (!isLt2M) {
                 this.$message.error('上传头像图片大小不能超过 2MB!');
                 }
                 return isJPG && isLt2M;*/
                return true;
            }
            /*menu-4...end*/
        }, created() {
            this.loadMarkdownOptions();
            this.loadMailCss();

            /*default*/
            this.switchMarkdown(this.markdowns[0], 0);
            this.defaultActiveMenu = "1-0";
            /*default...end*/

            /*debugger*/
//            this.menuIndex = "3";
//            this.defaultActiveMenu = "3";
            /*debugger...end*/
        }
    }
</script>

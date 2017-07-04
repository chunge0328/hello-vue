<style>
    .fontTitleStyle {
        font-size: 30px;
    }
</style>
<template>
    <div class="bg-white bgwidth">
        <el-row>
            <el-col :span="12">&nbsp;</el-col>
            <el-col :span="6">
                <header id="header" class="mui-bar mui-bar-nav">
                    <a class="mui-action-back mui-pull-left"></a>
                    <h1 class="mui-title">朋友圈话题</h1>
                </header>
            </el-col>
        </el-row>

        <el-row :gutter="20" class="top10">
            <el-col :span="6">&nbsp;</el-col>
            <el-col :span="12" class="fontTitleStyle">
                <b>朋友圈发布</b>
            </el-col>
        </el-row>
        <el-row :gutter="20" class="top10">
            <el-col :span="4"><b>内容：</b></el-col>
            <el-col :span="12">
                <el-input type="text" v-model="content"></el-input>
            </el-col>
        </el-row>
        <el-row :gutter="20" class="top10">
            <el-col :span="4"><b>大圈子ID：</b></el-col>
            <el-col :span="12">
                <el-input type="text" v-model="bid"></el-input>
            </el-col>
        </el-row>
        <el-row :gutter="20" class="top10">
            <el-col :span="4"><b>小圈子ID：</b></el-col>
            <el-col :span="12">
                <el-input type="text" v-model="sid"></el-input>
            </el-col>
        </el-row>
<!--        <el-row :gutter="20" class="top10">
            <el-col :span="4"><b>上传图片：</b></el-col>
            <el-col :span="12">
                <el-upload
                        class="upload-demo"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :on-change="upload"
                        list-type="picture-card">
                    <i class="el-icon-plus"></i>
                    <div slot="tip" class="el-upload__tip">只能上传图片文件，且不超过500kb</div>
                </el-upload>
            </el-col>
        </el-row>-->
        <el-row :gutter="20" class="top10">
            <el-col :span="4">&nbsp;</el-col>
            <el-col :span="12">
                <el-button type="primary" @click="topicPublish()">发表</el-button>
            </el-col>
        </el-row>

        <div style="margin: 20px;"></div>
        <el-row>
            <h4>话题列表查询</h4>
        </el-row>
        <div style="margin: 20px;"></div>
        <el-row>
            <el-table :data="topiclist" style="width: 100%">
                <el-table-column prop="author" label="作者" sortable></el-table-column>
                <el-table-column prop="content" label="内容"></el-table-column>
                <el-table-column prop="cdate" label="发表日期" sortable>
                    <template scope="scope">
                        <el-icon name="time"></el-icon>
                        <span style="margin-left: 10px">{{ scope.row.cdate }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="ctime" label="发表时间" sortable></el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button @click.native.prevent="topicDis(scope.$index, scope.row)" type="danger" size="small">
                            查看评论
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top: 20px;">
                <div class="block">
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="1"
                            :page-sizes="[5, 10, 15, 20]"
                            :page-size="limit"
                            layout="total, sizes, prev, pager, next"
                            :total="topiclistlength">
                    </el-pagination>
                </div>
            </div>
        </el-row>
    </div>
</template>

<script>
    require("element-ui/lib/theme-default/index.css");
    import Vue from "vue";
    import {Util} from '../../js/utils/ValidateUtils';
    import router from '../../js/config/OneRouterConfig';
    import {Button, Message, Row, Col, Tabs, TabPane, Input, Upload} from "element-ui";
    Vue.use(Button);
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Tabs);
    Vue.use(TabPane);
    Vue.use(Input);
    Vue.use(Upload);

    export default {
        data(){
            return {
                topiclist: null,
                topiclistlength: 0,
                page: 1,
                limit: 5,
                content: '',
                bid: '',
                sid: '',
                pic: ''
            };
        },
        created: function () {
            this.init();
        },
        methods: {
            init(){/*判断是否登录*/
                this.$http.jsonp("/web/act/login/checkLogin", {
                    params: {
                        mobile: this.$route.params.mobile
                    }
                }).then(function (res) {
                    if (!res.data.success) {
                        Message({
                            showClose: true,
                            message: "请先登录",
                            type: "warning"
                        });
                        router.push('/one/' + this.$route.params.mobile);
                    } else {
                        /*查询话题列表*/
                        this.getTopiclist();
                    }
                }.bind(this));

            },
            getTopiclist(){/*查询话题列表*/
                this.$http.jsonp("/app/theme/list", {
                    params: {
                        page: this.page,
                        limit: this.limit,
                        sort: JSON.stringify([{"property": "cdate", "direction": "DESC"}, {
                            "property": "ctime",
                            "direction": "DESC"
                        }])
                    }
                }).then(function (res) {
                    this.topiclist = res.data.items;
                    this.topiclistlength = res.data.total;
                }.bind(this));
            },
            inputCheck(){
                let content = this.content;
                let bid = this.bid;
                let sid = this.sid;
                if (!Util.isEmpty(content)) {
                    Message({
                        showClose: true,
                        message: "发表内容不能为空",
                        type: "error"
                    });
                    return false;
                } else if (!Util.isEmpty(bid)) {
                    Message({
                        showClose: true,
                        message: "大圈子ID不能为空",
                        type: "error"
                    });
                    return false;
                } else if (!Util.isEmpty(sid)) {
                    Message({
                        showClose: true,
                        message: "小圈子ID不能为空",
                        type: "error"
                    });
                    return false;
                } else {
                    return true;
                }
            },
            topicPublish(){
                if (this.inputCheck()) {
                    this.$http.jsonp("/app/theme/save", {
                        params: {
                            content: this.content,
                            bid: this.bid,
                            sid: this.sid
                        }
                    }).then(function (res) {
                        let data = res.data;
                        Message({
                            showClose: true,
                            message: data.success ? "发表成功" : data.message,
                            type: data.success ? "success" : 'error'
                        });
                        this.init();
                    }.bind(this));
                }
            },
            upload(file, fileList) {
                console.log(fileList.slice(-3));
            },
            topicDis(index, row){
                let item = row;
                router.push('/topicDetail/' + this.$route.params.mobile + '/' + item.id + '/' + item.author + '/' + item.content);
            },
            handleSizeChange(val) {
                this.limit = val;
                this.getTopiclist();
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getTopiclist();
            }
        }
    }
</script>

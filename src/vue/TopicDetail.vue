<style>
    .top10 {
        margin-top: 10px;
    }

    .aa {
        cursor: pointer;
        color: #FF4949
    }

    .content {
        color: #13CE66;
    }

</style>
<template>
    <div class="bg-white">
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
            <b>作者:{{author}} &nbsp;话题:{{content}}&nbsp;<i @click="laud()" class="el-icon-star-on aa bb">点赞</i></b>
        </el-row>

        <el-row :gutter="20" class="top10">
            <el-col :span="3"><b>点赞：</b></el-col>
            <el-col v-for="(result, index) in laudlist" :key="'laudlist'+index" :span="3">
                <span v-if="result.laudId == nickid" @click="qxlaud(result)" class="aa">{{result.laudName}}</span>
                <span v-else>{{result.laudName}}</span>
            </el-col>
        </el-row>
        <el-row v-for="(result, index) in dislist" :key="'dislist'+index" :gutter="20" class="top10">
            <el-row>
                <el-col :span="6">
                    <b>{{result.disUserName}}</b>&nbsp;{{result.coverUserId!=result.disUserId?"回复":''}}<b>&nbsp;{{result.coverUserId!=result.disUserId?result.coverUserName:''}}</b>:
                </el-col>
                <el-col :span="12"></el-col>
            </el-row>
            <el-row>
                <el-col :span="2">&nbsp;</el-col>
                <el-col :span="12" class="content">{{result.discontent}}&nbsp;&nbsp;
                    <a @click="reply(result)" class="aa">回复</a></el-col>
            </el-row>
        </el-row>

        <el-row :gutter="20" class="top10" v-show="flag">
            <el-row>
                <el-col :span="6">
                    <b>{{nickname}}</b>&nbsp;{{nickid!=reid?"回复":''}}&nbsp;<b>{{nickid!=reid?rename:''}}</b></el-col>
                <el-col :span="12">
                    <el-input type="textarea" v-model="desc"></el-input>
                    <el-button type="primary" @click="submit()">提交</el-button>
                </el-col>
            </el-row>
        </el-row>
    </div>
</template>

<script>
    require("element-ui/lib/theme-default/index.css");
    import Vue from "vue";
    import {Util} from '../js/utils/ValidateUtils';
    import router from '../js/config/RedRouterConfig';
    import {Button, Message, Row, Col, Input} from "element-ui";
    Vue.use(Button);
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Input);

    export default {
        data(){
            return {
                flag: false,
                author: this.$route.params.author,
                content: this.$route.params.content,
                dislist: null,
                laudlist: null,
                rename: '',
                reid: '',
                themeId: this.$route.params.id,
                nickname: '',
                nickid: '',
                desc: ''
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
                        this.nickname = res.data.data.nickname;
                        this.nickid = res.data.data.cid;
                        /*查询点赞列表*/
                        this.$http.jsonp("/app/themeLaud/list", {
                            params: {
                                themeId: this.$route.params.id,
                                sort: JSON.stringify([{"property": "cdate", "direction": "ASC"}, {
                                    "property": "ctime",
                                    "direction": "ASC"
                                }])
                            }
                        }).then(function (res) {
                            this.laudlist = res.data.items;
                            if (this.laudlist.length == 0) {
                                this.flag = true;
                                this.reid = this.nickid;
                            }
                        }.bind(this));
                        /*查询评论列表*/
                        this.$http.jsonp("/app/themeDis/list", {
                            params: {
                                themeId: this.$route.params.id,
                                sort: JSON.stringify([{"property": "cdate", "direction": "ASC"}, {
                                    "property": "ctime",
                                    "direction": "ASC"
                                }])
                            }
                        }).then(function (res) {
                            this.dislist = res.data.items;
                            if (this.dislist.length == 0) {
                                this.flag = true;
                                this.reid = this.nickid;
                            }
                        }.bind(this));
                    }
                }.bind(this));

            },
            reply(result){
                this.flag = true;
                this.reid = result.disUserId;
                this.rename = result.disUserName;
                this.themeId = result.themeId;
            },
            laud(){/*点赞*/
                this.$http.jsonp("/app/themeLaud/save", {
                    params: {
                        themeId: this.$route.params.id
                    }
                }).then(function (res) {
                    let data = res.data;
                    Message({
                        showClose: true,
                        message: data.success ? "点赞成功" : data.message,
                        type: data.success ? 'success' : 'warning'
                    });
                    if(data.success){
                        this.init();
                    }
                }.bind(this));
            },
            qxlaud(result){
                this.$http.jsonp("/app/themeLaud/del", {
                    params: {
                        id: result.id
                    }
                }).then(function (res) {
                    let data = res.data;
                    Message({
                        showClose: true,
                        message: data.success ? "取消点赞成功" : data.message,
                        type: data.success ? 'success' : 'warning'
                    });
                    if(data.success){
                        this.init();
                    }
                }.bind(this));
            },
            submit(){
                if (Util.isEmpty(this.des)) {
                    Message({showClose: true, message: "请输入评论内容", type: 'warning'});
                    return false;
                } else {
                    /*提交评论内容*/
                    this.$http.jsonp("/app/themeDis/save", {
                        params: {
                            themeId: this.themeId,
                            coverUserId: this.reid,
                            content: this.desc
                        }
                    }).then(function (res) {
                        if (res.data.success) {
                            this.flag = false;
                            this.desc = '';
                            Message({showClose: true, message: "评论成功", type: 'success'});
                            this.init();
                        }
                    }.bind(this));
                }
            }
        }
    }
</script>

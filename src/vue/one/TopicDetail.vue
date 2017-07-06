<style>
    .top10 {
        margin-top: 10px;
    }

    .aa {
        cursor: pointer;
        color: #FF4949
    }

    .content {
        color: #0D0D0D;
    }

    .classA {
        cursor: pointer;
        color: #FF4949
    }

    .classB {
        color: #0D0D0D;
    }

    .name:hover {
        cursor: pointer;
        color: red;
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
            <b class="name" @click="reply(customerId,author)">{{author}}</b>&nbsp;:&nbsp;{{content}}&nbsp;
        </el-row>

        <el-row :gutter="20" class="top10">
            <el-col :span="3">
                <i @click="laud()" class="el-icon-star-on aa bb">
                    <span v-if="!isLaud">点赞</span>
                    <span v-else>取消点赞</span>
                </i>
            </el-col>
            <el-col v-for="(result, index) in laudlist" :key="'laudlist'+index" :span="3">
                <span v-if="result.laudId == nickid"><b class="aa">{{result.laudName}}</b></span>
                <span v-else><b>{{result.laudName}}</b></span>
            </el-col>
        </el-row>
        <el-row v-for="(result, index) in dislist" :key="'dislist'+index" :gutter="20" class="top10">
            <el-row>
                <el-col>
                    <b class="name" @click="reply(result.disUserId,result.disUserName)">{{result.disUserName}}</b>&nbsp;
                    {{result.coverUserId!=result.disUserId?"@":''}}
                    <b class="name" @click="reply(result.coverUserId,result.coverUserName)">&nbsp;{{result.coverUserId!=result.disUserId?result.coverUserName:''}}</b>:
                </el-col>
            </el-row>
            <el-row>
                <el-col class="content">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{result.discontent}}&nbsp;&nbsp;
                </el-col>
            </el-row>
        </el-row>

        <el-row :gutter="20" class="top10" v-show="flag">
            <el-row>
                <el-col>
                    <b>{{nickname}}</b>&nbsp;{{nickid!=reid?"@":''}}&nbsp;<b>{{nickid!=reid?rename:''}}</b></el-col>
                <el-col>
                    <el-input type="textarea" v-model="desc"></el-input>
                    <el-button type="primary" @click="submit()" class="top10">提交</el-button>
                </el-col>
            </el-row>
        </el-row>
    </div>
</template>

<script>
    require("element-ui/lib/theme-default/index.css");
    import Vue from "vue";
    import $ from '../../js/utils/Util';
    import {Util} from '../../js/utils/ValidateUtils';
    import router from '../../js/config/OneRouterConfig';
    import {Button, Message, Row, Col, Input} from "element-ui";
    Vue.use(Button);
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Input);

    export default {
        data(){
            return {
                flag: false,
                customerId: this.$route.params.customerId,
                author: this.$route.params.author,
                content: this.$route.params.content,
                dislist: null,
                laudlist: null,
                rename: '',
                reid: '',
                themeId: this.$route.params.id,
                nickname: '',
                nickid: '',
                desc: '',
                isLaud: false,
                classmouse: false
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
                        /*查询客户自己是否点赞*/
                        this.$http.jsonp("/app/themeLaud/isLaud", {
                            params: {
                                themeId: this.$route.params.id
                            }
                        }).then(function (res) {
                            this.isLaud = res.data.success;
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
            reply(userId, userName){/*评论*/
                this.flag = true;
                this.reid = userId;
                this.rename = userName;
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
                        message: data.data.stat == 1 ? "点赞成功" : "取消点赞成功",
                        type: 'success'
                    });
                    if (data.success) {
                        this.init();
                    }
                }.bind(this));
            },
            submit(){
                if (!Util.isEmpty(this.des)) {
                    Message({showClose: true, message: "请输入评论内容", type: 'warning'});
                    return false;
                } else {
                    /*提交评论内容*/
                    this.$http.jsonp("/app/themeDis/save", {
                        params: {
                            themeId: this.$route.params.id,
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

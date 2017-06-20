<style>
    .top10 {
        margin-top: 10px;
    }

    .aa {
        cursor: pointer
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
            <b>作者:{{author}} &nbsp;话题:{{content}}</b>
        </el-row>
        <el-row v-for="(result, index) in dislist" :gutter="20" class="top10">
            <el-row>
                <el-col :span="6">
                    <b>{{result.disUserName}}</b>&nbsp;{{result.coverUserId!=result.disUserId?"回复":''}}<b>&nbsp;{{result.coverUserId!=result.disUserId?result.coverUserName:''}}</b>:
                </el-col>
                <el-col :span="12"></el-col>
            </el-row>
            <el-row>
                <el-col :span="2">&nbsp;</el-col>
                <el-col :span="12" class="content">{{result.discontent}}&nbsp;&nbsp;<a @click="reply(result)"
                                                                                       class="aa">回复</a></el-col>
            </el-row>
        </el-row>

        <el-row :gutter="20" class="top10" v-show="flag">
            <el-row>
                <el-col :span="6"><b>{{nickname}}</b>&nbsp;{{nickid!=reid?"回复":''}}&nbsp;<b>{{nickid!=reid?rename:''}}</b></el-col>
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
                        /*查询评论列表*/

                        this.$http.jsonp("/app/themeDis/list", {
                            params: {
                                themeId: this.$route.params.id
                            }
                        }).then(function (res) {
                            console.log(this.dislist)
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

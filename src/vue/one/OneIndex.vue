<style>

</style>
<template>
    <div class="bg-white">
        <el-row>
            <el-col :span="12">&nbsp;</el-col>
            <el-col :span="6">
                <header id="header" class="mui-bar mui-bar-nav">
                    <a class="mui-action-back mui-pull-left"></a>
                    <h1 class="mui-title">菜单</h1>
                </header>
            </el-col>
        </el-row>

        <el-row :gutter="20" class="top10">
            <el-col :span="4"><b>原昵称：</b></el-col>
            <el-col :span="12"><b>{{nickname}}</b></el-col>
        </el-row>
        <el-row :gutter="20" class="top10">
            <el-col :span="4"><b>新昵称：</b></el-col>
            <el-col :span="12">
                <el-input type="text" v-model="newName"></el-input>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" @click="modifyNickName()">修改昵称</el-button>
            </el-col>
        </el-row>

        <el-row :gutter="20" class="top10">
            <el-col :span="4"><b>功能：</b></el-col>
            <el-col :span="16">
                <el-button type="primary" @click="question()">问卷调查</el-button>
                <el-button type="primary" @click="point()">积分</el-button>
                <el-button type="primary" @click="fof()">智能体验馆</el-button>
                <el-button type="primary" @click="topic()">朋友圈话题</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    require("element-ui/lib/theme-default/index.css");
    import Vue from "vue";
    import {Util} from '../../js/utils/ValidateUtils';
    import router from '../../js/config/RedRouterConfig';
    import {Button, Message, Row, Col, Tabs, TabPane, Input} from "element-ui";
    Vue.use(Button);
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Tabs);
    Vue.use(TabPane);
    Vue.use(Input);

    export default {
        data(){
            return {
                nickname: '',
                newName: ''
            };
        },
        created: function () {
            this.init();
        },
        methods: {
            init(){
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
                    }
                }.bind(this));
            },
            modifyNickName(){
                if (!Util.isEmpty(this.newName)) {
                    Message({
                        showClose: true,
                        message: "请输入新昵称",
                        type: "warning"
                    });
                    return false;
                }
                this.$http.jsonp("/app/customer/saveNickName", {
                    params: {
                        nickName: this.newName
                    }
                }).then(function (res) {
                    if (!res.data.success) {
                        Message({
                            showClose: true,
                            message: "修改失败,请重新修改",
                            type: "error"
                        });
                    } else {
                        Message({
                            showClose: true,
                            message: "修改成功",
                            type: "success"
                        });
                        this.nickname = res.data.data.nickname;
                    }
                }.bind(this))
            },
            question(){/*跳转问卷*/
                router.push('/question/'+ this.$route.params.mobile);
            },
            fof(){/*跳转智能体验馆*/
                router.push('/fof/' + this.$route.params.mobile + '/' + this.$route.params.mobileCode);
            },
            point(){/*跳转积分*/
                router.push('/point/' + this.$route.params.mobile);
            },
            topic(){/*跳转朋友圈*/
                router.push('/topic/' + this.$route.params.mobile);
            }
        }
    }
</script>

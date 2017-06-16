<style>
    .sms_disabled {
        color: #bdbdbd;
    }
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

        <div style="margin: 20px;"></div>
        <el-row>
            <el-col :span="6">&nbsp;</el-col>
            <el-col :span="12">
                <el-row>
                    <el-button type="primary" @click="fof()">智能体验馆</el-button>
                </el-row>
                <div style="margin: 20px;"></div>
                <el-row>
                    <el-button type="primary" @click="point()">积分</el-button>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    require("element-ui/lib/theme-default/index.css");
    import Vue from "vue";
    import {Util} from '../js/utils/ValidateUtils';
    import router from '../js/config/RedRouterConfig';
    import {Button, Message, Row, Col,Tabs,TabPane} from "element-ui";
    Vue.use(Button);
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Tabs);
    Vue.use(TabPane);

    export default {
        data(){
            return {};
        },
        methods: {
            init(){
                this.$http.jsonp("/web/act/login/checkLogin", {params: {mobile: this.$route.params.mobile}}).then(function (res) {
                    if (!res.data.success) {
                        Message({showClose: true, message: "请先登录", type: "warning"});
                        router.push('/one/' + this.$route.params.mobile);
                    } else {

                    }
                }.bind(this))

            },
            fof(){/*跳转智能体验馆*/
                router.push('/fof/' + this.$route.params.mobile + '/' + this.$route.params.mobileCode);
            },
            point(){/*跳转积分*/
                router.push('/point/' + this.$route.params.mobile);
            }
        }
    }
</script>

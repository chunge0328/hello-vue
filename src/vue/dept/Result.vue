<style scoped>
    #test {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0px;
        background-color: #f0f0f0;
    }
</style>
<template>
    <div class="bg-white bgwidth" id = "test">
        <el-row :gutter="20" class="top10">
            <el-col :span="12">&nbsp;</el-col>
            <el-col :span="6">
                <header id="header" class="mui-bar mui-bar-nav">
                    <a class="mui-action-back mui-pull-left"></a>
                    <h1 class="mui-title">问卷调查结果</h1>
                </header>
            </el-col>
        </el-row>

        <el-row :gutter="20" class="top10">

            <pre style="font-size: 18px">
                下表是根据贵公司对上述问题回答的总分，借此评估贵公司在面对风险时所持有的“一般”态度。
                分数风险属性典型分类定义<br>
                <b> ▶ 18分  C1-保守型</b><br>
                代表贵公司可以接受以下情况：预期波动性极低。强烈关注资产的安全性，对风险高度厌恶。<br>
                <b>  ▶ 19分-30分 C2-平衡型</b><br>
                代表贵公司可以接受以下情况：预期波动性低，但非绝对保证。资产市值虽然波动较低，但可能低于原始投资本金。<br>
                <b>  ▶ 31分-42分 C3-稳健型</b><br>
                代表贵公司可以接受以下情况：较高的投资风险，希望预期报酬率可以优于中长期存款利率（3-5年）并确保投资本金不因通胀而贬值。资产市值会波动，而且可能低于原始投资本金。预期波动性高于“保守型”投资人。<br>
                <b>  ▶ 43分-54分 C4-积极型</b><br>
                代表贵公司可以接受以下情况：高度的投资风险，其短、中及长期的波动性均高，但也希望获得较高回报。资产市值会波动，而且可能远低于原始投资本金。预期波动性高于“稳健型”投资人。<br>
                <b>  ▶ 55分-62分 C5-进取型</b><br>
                代表贵公司可以接受以下情况：极高的风险偏好，希望得到远超大盘的投资回报。资产市值会波动，并且可能完全损失原始投资本金。预期波动性高于“积极型”投资人
                根据您所提供的答案，贵公司的总分是<b style="text-decoration: underline" >（     {{score}}     ）</b>  。参照以上定义，贵公司面对投资风险的“一般”承受度大致是 <b style="text-decoration: underline"> （    {{riskName}}       ）</b> 型。

            </pre>
        </el-row>


    </div>
</template>

<script>
    require("element-ui/lib/theme-default/index.css");

    import Vue from "vue";
    import $ from '../../js/utils/Util';
    import router from '../../js/config/DeptRouterConfig';
    import {
        Message, Radio, RadioGroup, Button, Row, Col, Input, Form, FormItem, CheckboxGroup, Checkbox,
    }
        from "element-ui";

    Vue.use(Radio);
    Vue.use(RadioGroup);
    Vue.use(Button);
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Input);
    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(CheckboxGroup);
    Vue.use(Checkbox);


    export default {

        data(){
            return {
                score:this.$route.params.score,
                riskName:this.$route.params.riskName
            }
        },
        created() {
            this.init();
        },
        methods: {}
    }
</script>

<style type="text/css">
</style>
<template>
    <div>
        <pre>hello codeutils</pre>
    </div>
</template>

<script>
    export default {
        data(){
            return {
            }
        },
        props: ["code"],
        methods: {
        },
        watch: {
            code(curVal, oldVal) {

            }
        },
        created(){
            this.$http.get("/ma/study/genJavaCode", {params: {}}).then(function (res) {
                let data = res.data;
                console.info(data)
            }.bind(this));
        }
    }
    ;
</script>
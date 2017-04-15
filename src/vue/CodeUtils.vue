<style type="text/css">
</style>
<template>
    <div>
        <div v-for="(code, ind) in javaCode">
            <div v-for="(sec, key) in code">
                <h3>{{key}}</h3>
                <pre v-for="(con, cou) in sec">{{con}}</pre>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                javaCode: []
            }
        },
        props: ["code"],
        methods: {},
        watch: {
            code(curVal, oldVal) {

            }
        },
        created(){
            this.$http.post("/ma/study/genJavaCode", {
                "entityFields": [
                    {
                        type: "String",
                        name: "name"
                    },
                    {
                        type: "Integer",
                        name: "type"
                    }
                ],
                "entityName": "Activity",
                "moduleName": "act",
                "packageName": "com.cifm",
                "projectName": "one",
                "sectionName": "api",
                "type": "company"
            }).then(function (res) {
                let data = res.data;
                this.javaCode = data.content;
            }.bind(this));
        }
    }
    ;
</script>
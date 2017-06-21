<style>
</style>
<template>
    <div class="bg-white">
        <database></database>
    </div>
</template>

<script>
    require("element-ui/lib/theme-default/index.css");

    import Vue from "vue";
    import Database from "../js/components/cifm/database/Database";
    Vue.use(Database);

    export default {

        data(){
            return {
            }
        },
        methods: {

        }, created() {
        }
    }
</script>

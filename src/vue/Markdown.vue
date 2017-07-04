<style type="text/css">
</style>
<template>
    <div>

        <div v-show="showTextArea"><textarea v-model="md" @keyup="markdownToHtml(md)"
                                             style="width: 100%;height: 300px;resize:none;"></textarea></div>
        <div v-html="html"></div>
    </div>
</template>

<script>
    require("../../resources/css/markdown.css")
    let md = require("markdown").markdown;
    export default {
        data(){
            return {
                md: "",
                html: "",
                showTextArea: true
            }
        },
        props: ["markdown", "setMarkdown"],
        methods: {
            markdownToHtml(markdown) {
                this.html = md.toHTML(markdown);
            }
        },
        watch: {
            md(curVal, oldVal) {
                this.markdownToHtml(this.md);
                if (this.setMarkdown && Object.prototype.toString.call(this.setMarkdown) == "[object Function]") {
                    this.setMarkdown(curVal, oldVal, this.html);
                }
            }
        },
        created(){
            this.md = this.markdown.content;
            if(this.markdown.requestPath) this.showTextArea = false;
            this.markdownToHtml(this.md);
        }
    }
    ;
</script>
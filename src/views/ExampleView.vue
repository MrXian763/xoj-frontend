<template>
  <div id="exampleView">
    <CodeEditor :value="codeValue" :handle-change="onCodeChange" />
    <MdEditor :value="mdValue" :handle-change="onMdChange" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import CodeEditor from "@/components/CodeEditor.vue";

// 代码编辑器值
const codeValue = ref("");
// Md 编辑器值
const mdValue = ref("");

const onCodeChange = (v: string) => {
  codeValue.value = v;
};

const onMdChange = (v: string) => {
  mdValue.value = v;
};
</script>

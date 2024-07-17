<template>
  <div
    id="code-editor"
    ref="codeEditorRef"
    style="min-height: 666px; min-width: 1000px"
  />
</template>

<script setup lang="ts">
import * as monaco from "monaco-editor";
import { onMounted, ref, watch, toRaw, withDefaults, defineProps } from "vue";

interface Props {
  value: string;
  handleChange: (v: string) => void;
}

const props = withDefaults(defineProps<Props>(), {
  value: "",
  handleChange: (v: string) => {
    console.log(v);
  },
});

const codeEditorRef = ref();
const codeEditor = ref();

/**
 * 在组件挂载时初始化编辑器
 */
onMounted(() => {
  if (!codeEditorRef.value) {
    return;
  }
  codeEditor.value = monaco.editor.create(codeEditorRef.value, {
    value: props.value,
    language: "java",
    automaticLayout: true,
    colorDecorators: true,
    minimap: {
      enabled: true,
    },
    readOnly: false,
    theme: "vs-dark",
  });

  // 监听值变化
  codeEditor.value.onDidChangeModelContent(() => {
    props.handleChange(toRaw(codeEditor.value).getValue());
  });
});

// 监听父组件传递的 value 属性变化
watch(
  () => props.value,
  (newValue) => {
    if (codeEditor.value && toRaw(codeEditor.value).getValue() !== newValue) {
      toRaw(codeEditor.value).setValue(newValue);
    }
  }
);
</script>

<style scoped></style>

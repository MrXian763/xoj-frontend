<!-- 代码编辑器页 -->
<template>
  <div
    id="code-editor"
    ref="codeEditorRef"
    style="min-height: 666px; min-width: 1000px"
  />
  <!--  <a-button @click="fillValue">填充值</a-button>-->
</template>
<script setup lang="ts">
import * as monaco from "monaco-editor";
import { onMounted, ref, toRaw, withDefaults, defineProps } from "vue";

/**
 * 定义组件属性类型
 */
interface Props {
  value: string;
  handleChange: (v: string) => void;
}

/**
 * 给组件指定初始值
 */
const props = withDefaults(defineProps<Props>(), {
  value: () => "",
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
    // 获取值
    props.handleChange(toRaw(codeEditor.value).getValue());
  });
});

const fillValue = () => {
  if (!codeEditor.value) {
    return;
  }
  // 改变值
  toRaw(codeEditor.value).setValue("新的值");
};
</script>

<style scoped></style>

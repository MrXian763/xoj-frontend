<!-- MarkDown 文档阅读器 -->
<template>
  <Viewer :value="props.value" :plugins="plugins" />
</template>

<script setup lang="ts">
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import math from "@bytemd/plugin-math";
import gemoji from "@bytemd/plugin-gemoji";
import { Viewer } from "@bytemd/vue-next";
import { withDefaults, defineProps } from "vue";

const plugins = [gfm(), highlight(), math(), gemoji()];

/**
 * 定义组件属性类型
 */
interface Props {
  value: string;
}

/**
 * 给组件指定初始值
 */
const props = withDefaults(defineProps<Props>(), {
  value: () => "",
});
</script>

<style>
.bytemd-toolbar-icon.bytemd-tippy.bytemd-tippy-right:last-child {
  display: none;
}
</style>

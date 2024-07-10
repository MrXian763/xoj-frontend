<template>
  <div id="app">
    <basic-layout />
  </div>
</template>

<script setup lang="ts">
import BasicLayout from "@/layouts/BasicLayout.vue";
import { onMounted } from "vue";

onMounted(() => {
  doInit();
});

/**
 * 全局初始化函数
 */
const doInit = () => {
  console.log("请遵守比赛规则");
};
</script>

<style></style>

<template>
  <div id="app">
    <template v-if="route.path.startsWith('/user')">
      <router-view />
    </template>
    <template v-else>
      <basic-layout />
    </template>
  </div>
</template>

<script setup lang="ts">
import BasicLayout from "@/layouts/BasicLayout.vue";
import { onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

onMounted(() => {
  doInit();
});

/**
 * 全局初始化函数
 */
const doInit = () => {
  console.log(
    "________         .__  .__                     ____.         .___              \n" +
      "\\_____  \\   ____ |  | |__| ____   ____       |    |__ __  __| _/ ____   ____  \n" +
      " /   |   \\ /    \\|  | |  |/    \\_/ __ \\      |    |  |  \\/ __ | / ___\\_/ __ \\ \n" +
      "/    |    \\   |  \\  |_|  |   |  \\  ___/  /\\__|    |  |  / /_/ |/ /_/  >  ___/ \n" +
      "\\_______  /___|  /____/__|___|  /\\___  > \\________|____/\\____ |\\___  / \\___  >\n" +
      "        \\/     \\/             \\/     \\/                      \\/_____/      \\/\n" +
      "=================================By 程序员冼紫菜================================"
  );
};
</script>

<style></style>

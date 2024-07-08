<template>
  <a-row
    id="globalHeader"
    class="grid-demo"
    style="margin-bottom: 16px"
    align="center"
  >
    <a-col flex="350px">
      <div class="title-bar">
        <img class="logo" src="../assets/universityLogo.png" />
        <div class="title">广理编协 OJ 系统</div>
      </div>
    </a-col>
    <a-col flex="auto">
      <a-menu
        mode="horizontal"
        :selected-keys="selectedKeys"
        @menu-item-click="doMenuClick"
      >
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '38px' }"
          disabled
        >
        </a-menu-item>
        <a-menu-item v-for="item in routes" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="100px">
      <div>
        {{ store.state?.user?.loginUser?.userName ?? "未登录" }}
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { routes } from "@/router/routes";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();

setTimeout(() => {
  store.dispatch("user/getLoginUser", {
    userName: "紫菜",
  });
}, 3000);

// 默认主页
const selectedKeys = ref(["/"]);

// 路由跳转后，更新选中的菜单项
router.afterEach((to, from, failure) => {
  selectedKeys.value = [to.path];
});

/**
 * 点击菜单触发事件
 * @param key 路由地址
 */
const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};
</script>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: #232222;
  margin-left: 16px;
}

.logo {
  height: 48px;
}
</style>

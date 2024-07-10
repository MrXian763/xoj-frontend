<template>
  <a-row id="globalHeader" class="grid-demo" align="center" :wrap="false">
    <a-col flex="555px">
      <div class="title-bar">
        <img class="logo" src="../assets/universityLogo.png" />
      </div>
    </a-col>
    <a-col flex="auto" class="right-align">
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
        <a-menu-item v-for="item in visibleRoutes" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="200px" class="user">
      <div>
        {{ store.state?.user?.loginUser?.userName ?? "未登录" }}
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { routes } from "@/router/routes";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import ACCESS_ENUM from "@/access/accessEnum";

const router = useRouter();
const store = useStore();

// 默认主页
const selectedKeys = ref(["/"]);

// 展示在菜单的路由数组
const visibleRoutes = computed(() => {
  return routes.filter((item, index) => {
    // 过滤掉隐藏的菜单
    if (item.meta?.hideInMenu) {
      return false;
    }
    // 根据权限显示菜单
    if (
      !checkAccess(store.state.user.loginUser, item?.meta?.access as string)
    ) {
      return false;
    }
    return true;
  });
});

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
.right-align {
  display: flex;
  justify-content: flex-end;
  text-align: right;
}

.title-bar {
  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  color: #232222;
  margin-left: 16px;
}

.logo {
  height: 48px;
}

.user {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

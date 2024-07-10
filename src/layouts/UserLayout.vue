<template>
  <div id="userLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <div class="title-bar">
          <img class="logo" src="../assets/universityLogo.png" />
        </div>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        <a
          href="https://wx.zsxq.com/dweb2/index/group/28888258455181"
          target="_blank"
        >
          广理编协知识星球 by 紫菜
        </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts"></script>

<style>
#userLayout {
}

#userLayout .header {
  box-shadow: #eee 1px 1px 5px;
}

#userLayout .content {
  text-align: center;
  background-color: #f0f8ff;
}

#userLayout .footer {
  background: #efefef;
  padding: 16px;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}

.title-bar {
  width: 555px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  height: 48px;
}
</style>

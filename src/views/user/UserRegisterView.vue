<!--用户注册页-->
<template>
  <div id="userLoginView">
    <div class="login-container">
      <h2>用户注册</h2>
      <a-form :model="form" @submit="handleSubmit">
        <a-form-item field="账号" tooltip="6-20位数字" label="账号">
          <a-input v-model="form.userAccount" placeholder="请输入账号" />
        </a-form-item>
        <a-form-item
          field="密码"
          tooltip="8-20位数字、大小写字母、下划线等"
          label="密码"
        >
          <a-input-password
            v-model="form.userPassword"
            placeholder="请输入密码"
          />
        </a-form-item>
        <a-form-item field="确认密码" label="确认密码">
          <a-input-password
            v-model="form.checkPassword"
            placeholder="请输入确认密码"
          />
        </a-form-item>
        <a class="login-link" @click="goToLogin">已有账号？点击登录</a>
        <a-form-item>
          <a-button type="primary" html-type="submit" block>注册</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { UserControllerService, UserRegisterRequest } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();

/**
 * 表单信息
 */
const form = reactive({
  userAccount: "",
  userPassword: "",
  checkPassword: "",
}) as UserRegisterRequest;

/**
 * 提交注册请求
 */
const handleSubmit = async () => {
  const res = await UserControllerService.userRegisterUsingPost(form);
  await store.dispatch("user/getLoginUser");
  // 注册成功，跳转到登录页
  if (res.code === 0) {
    message.success("注册成功");
    router.push({
      path: "/user/login",
      replace: true,
    });
  } else {
    message.error("注册失败，" + res.message);
  }
};

/**
 * 跳转到登录页
 */
const goToLogin = () => {
  router.push({
    path: "/user/login",
    replace: true,
  });
};
</script>

<style>
#userLoginView {
  display: grid;
  place-items: center;
  height: 83vh;
  padding: 20px;
  box-sizing: border-box;
}

.login-container {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.login-link {
  font-size: 12px;
  color: #1890ff;
  cursor: pointer;
  text-decoration: none;
  text-align: right;
}

h2 {
  text-align: center;
  margin-bottom: 24px;
}

a-form-item {
  margin-bottom: 16px;
}

a-button {
  width: 100%;
}
</style>

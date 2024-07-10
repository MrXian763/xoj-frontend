<template>
  <div id="userLoginView">
    <div class="login-container">
      <h2>用户登录</h2>
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
        <a-form-item>
          <a-button type="primary" html-type="submit" block>登录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { UserControllerService, UserLoginRequest } from "../../../generated";
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
}) as UserLoginRequest;

/**
 * 提交登录请求
 */
const handleSubmit = async () => {
  const res = await UserControllerService.userLoginUsingPost(form);
  await store.dispatch("user/getLoginUser");
  console.log(store.state.user.loginUser);
  // 登录成功，跳转到主页
  if (res.code === 0) {
    router.push({
      path: "/",
      replace: true,
    });
  } else {
    message.error("登录失败，" + res.message);
  }
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

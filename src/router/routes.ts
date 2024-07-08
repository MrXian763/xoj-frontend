import { RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AdminView from "@/views/AdminView.vue";
import AboutView from "@/views/AboutView.vue";
import NoAuthView from "@/views/NoAuthView.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "浏览题目",
    component: HomeView,
  },
  {
    path: "/admin",
    name: "管理员可见",
    component: AdminView,
    meta: {
      access: "canAdmin",
    },
  },
  {
    path: "/about",
    name: "关于我的",
    component: AboutView,
  },
  {
    path: "/noAuth",
    name: "无权限",
    component: NoAuthView,
  },
];

import type {RouteRecordRaw} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("../views/Login.vue"),
  },
  {
        path: "/login",
        component: () => import("../views/Login.vue"),
    },
];

export default routes;

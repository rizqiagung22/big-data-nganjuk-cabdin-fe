import type {RouteRecordRaw} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/super-admin",
    component: () => import("../views/Layout.vue"),
    children: [
      {
        path: "",
        component: () => import("../views/BPOPP.vue"),
      },
      {
        path: "bpopp",
        component: () => import("../views/BPOPP.vue"),
      },
      {
        path: "bos",
        component: () => import("../views/BOS.vue"),
      },
      {
        path: "asset",
        component: () => import("../views/Asset.vue"),
      },
      {
        path: "pip",
        component: () => import("../views/PIP.vue"),
      },
      {
        path: "prestasi-siswa",
        component: () => import("../views/PrestasiSiswa.vue"),
      },
      {
        path: "data-siswa",
        component: () => import("../views/DataSiswa.vue"),
      },
      {
        path: "data-guru-dan-tenaga-pendidikan",
        component: () => import("../views/DataGuruDanTenagaPendidikan.vue"),
      },
      {
        path: "tahun",
        component: () => import("../views/Tahun.vue"),
      },
    ]
  },
];

export default routes;

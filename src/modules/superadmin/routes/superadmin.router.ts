import type {RouteRecordRaw} from "vue-router";

const routes: RouteRecordRaw[] = [
    {
        path: "/super-admin",
        component: () => import("../views/Layout.vue"),
        children: [
            {
                path: "bpopp",
                component: () => import("../views/BPOPP.vue"),
            },
            {
                path: "",
                component: () => import("../views/BPOPP.vue"),
            },
        ]
    },
];

export default routes;

import type {RouteRecordRaw} from "vue-router";

const routes: RouteRecordRaw[] = [
    {
        path: "/user",
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

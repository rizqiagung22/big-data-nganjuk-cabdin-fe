import AppVue from "@/App.vue";
import { extractFilename } from "@/core/helper/file.helper.ts";
import routes from "@/routes";
import { createPinia } from "pinia";
import { type Component, createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import "./style.css";


const AppInit = async (cb?: () => void) => {
    const pinia = createPinia();
    const app = createApp(AppVue);
    const router = createRouter({
        history: createWebHistory('/'),
        scrollBehavior() {
            return { top: 0 };
        },
        routes,
    });

    app.use(pinia);
    app.use(router);

    // Register global components
    const componentFiles: Record<string, Component> = import.meta.glob("../core/components/*", {
        eager: true,
        import: "default",
    });

    Object.keys(componentFiles).forEach((key: string) => {
        if (key === "./index.js" || key === "./index.ts") return;
        app.component(extractFilename(key), componentFiles[key]);
    });


    cb?.();

    app.mount("#app");
};
await AppInit();


import type {RouteRecordRaw} from "vue-router";

const routes: RouteRecordRaw[] = [];

const componentFiles: Record<string, RouteRecordRaw[]> = import.meta.glob(
  "../src/modules/**/*.router.ts",
  {
    eager: true,
    import: "default",
  }
);

Object.keys(componentFiles).forEach((key: string) => {
  if (key === "./index.js" || key === "./index.ts") return;

  routes.push(...componentFiles[key]);
});

export default routes;

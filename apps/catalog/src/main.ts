import { createApp } from "vue";
import "../../../packages/ui/src/style.css";
import "../../../packages/ui/src/fonts.css";
import "./studio.css";
import "./library.css";
const { default: App } = await (new URLSearchParams(location.search).has("case")
  ? import("./CasePage.vue")
  : import("./App.vue"));
createApp(App).mount("#app");

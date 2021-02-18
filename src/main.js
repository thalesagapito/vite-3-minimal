import { createSSRApp } from 'vue'
import { metaManager } from './plugins/vue-meta';
import { createRouter } from './plugins/router';
import { axios } from './plugins/axios';
import App from './App.vue'
import './index.css';



export function createApp() {
  const app = createSSRApp(App);
  const router = createRouter();
  app
    .use(router)
    .use(metaManager)
    .use(axios);
    
  return { app, router };
}
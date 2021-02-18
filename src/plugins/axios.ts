import $axios from 'axios';
import { inject, InjectionKey, Plugin } from 'vue';

const key: InjectionKey<typeof $axios> = Symbol('axios');

export const axios: Plugin = {
  install: (app) => {
    app.provide(key, $axios);
    app.config.globalProperties.$axios = $axios;
  },
};

export function useAxios() {
  return inject(key) as typeof $axios;
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $axios: typeof $axios;
  }
}

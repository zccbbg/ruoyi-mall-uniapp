import App from './App';
import { createSSRApp } from 'vue';
import { setupPinia } from './sheep/store';
import share from './mixins/share.js'


export function createApp() {

  const app = createSSRApp(App);
  app.mixin(share)
  setupPinia(app);

  return {
    app,
  };
}

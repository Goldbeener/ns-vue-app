import { createApp, registerElement } from 'nativescript-vue';

import App from './App.vue';

registerElement(
  'AnimatedCircle',
  // eslint-disable-next-line ts/no-require-imports
  () => require('@nativescript/animated-circle').AnimatedCircle,
);

createApp(App).start();

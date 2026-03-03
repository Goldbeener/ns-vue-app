import type { NativeScriptConfig } from '@nativescript/core';

export default {
  id: 'org.nativescript.dancingSean',
  appPath: 'src',
  appResourcesPath: 'App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none',
  },
  iOS: {
    deploymentTarget: '13.0',
  },
} as NativeScriptConfig;

import antfu from '@antfu/eslint-config';

export default antfu({
  ignores: [
    'node_modules',
    'App_Resources',
    'platforms',
  ],
  vue: true,
  lessOpinionated: true,
  formatters: true,
}, {
  rules: {
    'style/semi': ['warn', 'always'],
    'style/no-mixed-operators': 'off',
    'no-console': 'off',
    'no-debugger': 'off',
    'node/prefer-global/process': 'off',
    'ts/no-non-null-asserted-optional-chain': 'warn',
    'ts/no-redeclare': 'off',
    'ts/ban-ts-comment': 'off',
    'ts/no-extra-non-null-assertion': 'off',
    'vue/block-order': 'off',
    'vue/no-export-in-script-setup': 'off',
    'vue/no-lone-template': 'off',
    'vue/attribute-hyphenation': 'off',
    'vue/no-deprecated-html-element-is': 'off',
  },
  ignores: [
    'dist',
    'temp',
  ],
});

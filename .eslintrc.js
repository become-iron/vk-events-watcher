const off = 0
const warn = 1
const error = 2
const isProduction = process.env.NODE_ENV === 'production'
const errorOnProduction = isProduction ? error : warn

module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/recommended',
    'eslint:recommended'
  ],
  rules: {
    'no-console': [errorOnProduction, { allow: ['error'] }],
    'no-unused-vars': errorOnProduction,

    'vue/no-unused-components': warn,
    // 'vue/script-indent': [error, 2, { baseIndent: 1, switchCase: 1 }]
  },
  // overrides: [
  //   {
  //     files: ['*.vue'],
  //     rules: {
  //       indent: off,
  //       'max-len': off
  //     }
  //   }
  // ],
  parserOptions: {
    parser: 'babel-eslint'
  }
}

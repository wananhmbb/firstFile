module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: ["prettier"],
  extends: [
    "eslint:recommended",
    "plugin:vue/essential",
    "plugin:prettier/recommended"
  ],
  parserOptions: {
    parser: "@babel/eslint-parser"
  },
  globals: {
    uni: true,
    wx: true
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "warn",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    // 禁止在循环中出现 await
    "no-await-in-loop": "warn",
    "no-extra-parens": "warn",
    // 要求使用 === 和 !==
    eqeqeq: "error",
    // 禁用不必要的嵌套块
    "no-lone-blocks": "error",
    // 禁止使用短符号进行类型转换
    "no-implicit-coercion": "error"
  }
}

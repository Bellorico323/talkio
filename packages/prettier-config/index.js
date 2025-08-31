/** @type {import("prettier").Config} */
const config = {
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
  jsxSingleQuote: false,
  printWidth: 80,
  tabWidth: 2,
  bracketSameLine: false,

  plugins: ['prettier-plugin-tailwindcss']
};

export default config;
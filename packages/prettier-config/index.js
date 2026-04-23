import * as tailwindcss from 'prettier-plugin-tailwindcss'

/** @type {import("prettier").Config} */
const config = {
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
  jsxSingleQuote: false,
  printWidth: 80,
  tabWidth: 2,
  bracketSameLine: false,

  plugins: [tailwindcss],
}

export default config
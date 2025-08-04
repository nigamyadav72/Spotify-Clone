import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [
  ...compat.config({
    extends: [
      'next/core-web-vitals',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'prettier' // optional, for formatting consistency
    ],
  }),
]

export default eslintConfig

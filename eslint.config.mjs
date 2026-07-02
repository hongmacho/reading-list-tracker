import nextPlugin from "@next/eslint-plugin-next";
import typescriptEslint from "typescript-eslint";

export default [
  {
    ignores: [".next/**", "node_modules/**", "dist/**"],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: typescriptEslint.parser,
      parserOptions: {
        project: true,
      },
    },
    plugins: {
      "@next/next": nextPlugin,
      "@typescript-eslint": typescriptEslint.plugin,
    },
    rules: {
      "@next/next/no-html-link-for-pages": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
];

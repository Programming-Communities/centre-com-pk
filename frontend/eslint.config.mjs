// eslint.config.mjs
import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Professional configuration - strict for production, relaxed for dev
    rules: {
      // Turn errors into warnings for development
      "@typescript-eslint/no-explicit-any": process.env.NODE_ENV === 'production' ? "error" : "warn",
      "react-hooks/exhaustive-deps": "warn",
      "@next/next/no-img-element": process.env.NODE_ENV === 'production' ? "error" : "warn",
      "react/no-unescaped-entities": "warn",
      "react-hooks/set-state-in-effect": process.env.NODE_ENV === 'production' ? "error" : "off",
      "@typescript-eslint/no-unused-vars": [
        "warn", 
        { 
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_"
        }
      ],
      "prefer-const": "error",
      "react-hooks/purity": process.env.NODE_ENV === 'production' ? "error" : "off",
      "react-hooks/immutability": process.env.NODE_ENV === 'production' ? "error" : "off",
    },
    languageOptions: {
      globals: {
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
        navigator: "readonly",
      },
    },
  },
  {
    ignores: [
      "**/.next/**",
      "**/node_modules/**",
      "**/scripts/**",
      "**/*.config.js",
      "**/*.config.mjs",
      "**/public/**",
      "**/logs/**",
    ],
  },
]);
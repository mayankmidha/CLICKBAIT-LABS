import path from "node:path";
import { createRequire } from "node:module";
import { defineConfig, globalIgnores } from "eslint/config";

const require = createRequire(import.meta.url);
const eslintConfigNextPath = require.resolve("eslint-config-next");

// Resolve Next's lint dependencies from the package that owns them so pnpm and
// Vercel installs behave the same way.
const resolveFromNext = (packageName) =>
  require.resolve(packageName, {
    paths: [path.dirname(eslintConfigNextPath)],
  });

const nextPlugin = require(resolveFromNext("@next/eslint-plugin-next"));
const reactPlugin = require(resolveFromNext("eslint-plugin-react"));
const reactHooksPlugin = require(resolveFromNext("eslint-plugin-react-hooks"));
const jsxA11yPlugin = require(resolveFromNext("eslint-plugin-jsx-a11y"));
const importPlugin = require(resolveFromNext("eslint-plugin-import"));
const typescriptPlugin = require(
  resolveFromNext("@typescript-eslint/eslint-plugin"),
);
const typescriptParserPath = resolveFromNext("@typescript-eslint/parser");
const nodeResolverPath = resolveFromNext("eslint-import-resolver-node");
const typescriptResolverPath = resolveFromNext(
  "eslint-import-resolver-typescript",
);

const typescriptConfigs = typescriptPlugin.configs["flat/recommended"].map(
  (config) =>
    config.files
      ? config
      : {
          ...config,
          files: ["**/*.{ts,tsx,mts,cts}"],
        },
);

const eslintConfig = defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx,mts,cts}"],
    plugins: {
      "@next/next": nextPlugin,
      import: importPlugin,
      "jsx-a11y": jsxA11yPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/parsers": {
        [typescriptParserPath]: [".ts", ".mts", ".cts", ".tsx", ".d.ts"],
      },
      "import/resolver": {
        [nodeResolverPath]: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
        [typescriptResolverPath]: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      ...reactPlugin.configs.flat["jsx-runtime"].rules,
      ...reactHooksPlugin.configs["recommended-latest"].rules,
      ...jsxA11yPlugin.flatConfigs.recommended.rules,
      ...importPlugin.flatConfigs.recommended.rules,
      ...importPlugin.flatConfigs.typescript.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "import/no-anonymous-default-export": "warn",
      "jsx-a11y/alt-text": ["warn", { elements: ["img"], img: ["Image"] }],
      "jsx-a11y/aria-props": "warn",
      "jsx-a11y/aria-proptypes": "warn",
      "jsx-a11y/aria-unsupported-elements": "warn",
      "jsx-a11y/role-has-required-aria-props": "warn",
      "jsx-a11y/role-supports-aria-props": "warn",
      "react/jsx-no-target-blank": "off",
      "react/no-unknown-property": "off",
      "react/prop-types": "off",
    },
  },
  ...typescriptConfigs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

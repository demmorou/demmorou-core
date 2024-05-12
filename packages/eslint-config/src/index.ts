module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    "airbnb-base",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "eslint-plugin-import-helpers", "prettier"],
  rules: {
    camelcase: "off",
    "no-underscore-dangle": "off",
    "import/no-unresolved": "error",
    "max-classes-per-file": ["error", 100],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: ["interface", "class"],
        format: ["PascalCase"],
      },
      {
        selector: ["function", "classProperty", "classMethod"],
        format: ["camelCase", "snake_case"],
      },
      {
        selector: ["enum"],
        format: ["PascalCase"],
      },
      {
        selector: ["enumMember"],
        format: ["UPPER_CASE"],
      },
    ],
    "no-inline-comments": "error",
    "class-methods-use-this": "off",
    "import/prefer-default-export": "off",
    "no-shadow": "off",
    "no-console": "off",
    "no-useless-constructor": "off",
    "no-empty-function": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "lines-between-class-members": "off",
    "newline-after-var": "error",
    "newline-before-return": "error",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/prefer-namespace-keyword": ["off"],
    "@typescript-eslint/no-namespace": "off",
    "no-loop-func": "error",
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        ts: "never",
      },
    ],
    "import-helpers/order-imports": [
      "warn",
      {
        newlinesBetween: "always",
        groups: [
          "module",
          "/^@/",
          "/^@demmorou/",
          ["parent", "sibling", "index"],
        ],
        alphabetize: {
          order: "asc",
          ignoreCase: true,
        },
      },
    ],
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: ["**/*.spec.js"],
      },
    ],
    "prettier/prettier": [
      "error",
      {
        singleQuote: true,
        trailingComma: "all",
      },
    ],
  },
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
};

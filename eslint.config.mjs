import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

const featureNames = [
  "analytics",
  "app-shell",
  "auth",
  "dashboard",
  "integrations",
  "markets",
  "notifications",
  "otc",
  "portfolio",
  "trade",
]

const featureBoundaryConfigs = featureNames.map((source) => ({
  files: ["features/" + source + "/**/*.{ts,tsx}"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          ...featureNames
            .filter((target) => target !== source)
            .map((target) => ({
              group: ["@/features/" + target + "/**"],
              message:
                "Import " + target + " through its public feature entry.",
            })),
          {
            group: ["@/app/**"],
            message: "Features must not depend on app routes.",
          },
        ],
      },
    ],
  },
}))

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...featureBoundaryConfigs,
  {
    files: ["shared/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/**"],
              message: "shared must not depend on features.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["app/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*/**"],
              message: "Import features through their public entry.",
            },
          ],
        },
      ],
    },
  },

  {
    files: ["shared/charts/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
])

export default eslintConfig

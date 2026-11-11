import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import boundaries from "eslint-plugin-boundaries";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/**
 * A feature may only be imported through its public entry (`features/<name>`),
 * never through its internal files.
 */
const featureDeepImport = {
  group: ["@/features/*/*"],
  message:
    "Import a feature only through its public entry: @/features/<name> (its index.ts).",
};

/**
 * Only server-side data files may import the Supabase clients.
 */
const supabaseImport = {
  group: ["@/lib/supabase", "@/lib/supabase/*"],
  message:
    "Only queries.ts, actions.ts and src/lib/supabase may import the Supabase clients.",
};

/** Builds one boundary policy: `from` may import every type in `to`. */
function policy(from, to) {
  return {
    from: { element: { type: from } },
    allow: to.map((type) => ({ to: { element: { type } } })),
  };
}

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "coverage/**",
      "next-env.d.ts",
      "DOCS",
      "DOCS/**",
      "public",
      "public/**",
    ],
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { boundaries },
    settings: {
      "boundaries/legacy-warnings": false,
      "boundaries/elements": [
        { type: "app", pattern: "src/app/**" },
        { type: "feature", pattern: "src/features/*/**", capture: ["feature"] },
        { type: "components", pattern: "src/components/**" },
        { type: "lib", pattern: "src/lib/**" },
        { type: "config", pattern: "src/config/**" },
        { type: "types", pattern: "src/types/**" },
        { type: "messages", pattern: "src/messages/**" },
        { type: "styles", pattern: "src/styles/**" },
      ],
      "boundaries/ignore": ["src/middleware.ts"],
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          policies: [
            policy("app", [
              "feature",
              "components",
              "lib",
              "config",
              "types",
              "messages",
              "styles",
            ]),
            policy("feature", [
              "feature",
              "components",
              "lib",
              "config",
              "types",
            ]),
            policy("components", ["components", "lib", "config", "types"]),
            policy("lib", ["lib", "config", "types", "messages"]),
            policy("config", ["config", "types"]),
          ],
        },
      ],
      "no-restricted-imports": [
        "error",
        { patterns: [featureDeepImport, supabaseImport] },
      ],
    },
  },
  {
    files: [
      "src/features/**/queries.ts",
      "src/features/**/actions.ts",
      "src/lib/supabase/**",
      "src/middleware.ts",
    ],
    rules: {
      "no-restricted-imports": ["error", { patterns: [featureDeepImport] }],
    },
  },
];

export default eslintConfig;

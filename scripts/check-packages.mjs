import {
  cpSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Generated consumer fixtures live in the existing ignored validation area.
// They install tarballs, never workspace links or aliases to package source.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const consumer = path.join(root, ".consumer-check");
const npmCli = process.env.npm_execpath;
if (!npmCli) throw Error("Run through npm run check:packages.");
const packages = [
  "tokens",
  "styles",
  "effects",
  "stream",
  "ui",
  "react",
];
const npm = (args, cwd, capture = false) =>
  execFileSync(process.execPath, [npmCli, ...args], {
    cwd,
    stdio: capture ? ["ignore", "pipe", "pipe"] : "inherit",
    encoding: "utf8",
  });
const packed = JSON.parse(
  npm(
    [
      "pack",
      ...packages.map((name) => `--workspace=@ai-design-system/${name}`),
      "--pack-destination",
      root,
      "--json",
    ],
    root,
    true,
  ),
);
const installedVersion = (name) =>
  JSON.parse(
    readFileSync(path.join(root, "node_modules", name, "package.json"), "utf8"),
  ).version;
const dependencies = Object.fromEntries(
  packed.map((pkg) => [pkg.name, `file:../${pkg.filename}`]),
);
for (const name of ["vue", "reka-ui", "react", "react-dom"])
  dependencies[name] = installedVersion(name);
const devDependencies = Object.fromEntries(
  [
    "@vitejs/plugin-vue",
    "@types/react",
    "@types/react-dom",
    "@types/node",
    "vite",
    "typescript",
    "vue-tsc",
  ].map((name) => [name, installedVersion(name)]),
);
mkdirSync(consumer, { recursive: true });
writeFileSync(
  path.join(consumer, "package.json"),
  JSON.stringify(
    {
      name: "design-ui-consumer-check",
      private: true,
      type: "module",
      scripts: {
        build:
          "vue-tsc --noEmit -p examples/tsconfig.json && vite build --config examples/vite.config.ts",
        dev: "vite --config examples/vite.config.ts --port 4320",
      },
      dependencies,
      devDependencies,
    },
    null,
    2,
  ) + "\n",
);
cpSync(path.join(root, "examples"), path.join(consumer, "examples"), {
  recursive: true,
});
// Explicit tarball arguments refresh npm's lockfile integrity even when a local
// development package was rebuilt under the same version and filename.
npm(
  [
    "install",
    "--no-audit",
    "--no-fund",
    ...packed.map((pkg) => `../${pkg.filename}`),
  ],
  consumer,
);
for (const pkg of packed) {
  const installed = realpathSync(path.join(consumer, "node_modules", pkg.name));
  if (!installed.startsWith(consumer + path.sep))
    throw Error(`Package is not independently installed: ${pkg.name}`);
  const workspace = path.join(
    root,
    `packages/${pkg.name.slice("@ai-design-system/".length)}`,
  );
  for (const file of pkg.files) {
    if (
      !readFileSync(path.join(installed, file.path)).equals(
        readFileSync(path.join(workspace, file.path)),
      )
    )
      throw Error(
        `Installed package differs from the packed source: ${pkg.name}/${file.path}`,
      );
  }
}
npm(["run", "build"], consumer);
const evidence = packed.map((pkg) => ({
  name: pkg.name,
  version: pkg.version,
  filename: pkg.filename,
  bytes: pkg.size,
  sha256: createHash("sha256")
    .update(readFileSync(path.join(root, pkg.filename)))
    .digest("hex"),
}));
writeFileSync(
  path.join(consumer, "package-evidence.json"),
  JSON.stringify(
    {
      verifiedAt: new Date().toISOString(),
      checks: [
        "independent tarball installation",
        "every installed package file matches the packed source",
        "Vue and React typecheck",
        "production build",
      ],
      packages: evidence,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  JSON.stringify(
    {
      state: "verified",
      packages: evidence,
      preview: "npm run dev --prefix .consumer-check",
    },
    null,
    2,
  ),
);

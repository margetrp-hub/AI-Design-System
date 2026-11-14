import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { root, manifestPath, inputHashes } from "./build-registry.mjs";
const args = process.argv.slice(2),
  command = args.shift(),
  output = (value) => console.log(JSON.stringify(value, null, 2));
function fail(state, message, detail, code = 2) {
  output({ state, message, ...detail });
  process.exit(code);
}
const allowed = ["find", "show", "list", "doctor"];
if (!allowed.includes(command))
  fail(
    "invalid",
    "Usage: npm run ui -- <find|show|list> --framework <vue|react> [query]; npm run ui -- doctor",
  );
if (!existsSync(manifestPath))
  fail("stale", "Missing registry. Run npm run build:registry.", undefined, 4);
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const current = inputHashes(),
  changed = [
    ...new Set([...Object.keys(current), ...Object.keys(manifest.inputs)]),
  ].filter((file) => current[file] !== manifest.inputs[file]);
if (changed.length)
  fail(
    "stale",
    "Source changed. Run npm run build:registry, then retry.",
    { changed },
    4,
  );
if (command === "doctor") {
  if (args.length) fail("invalid", "doctor takes no arguments");
  output({
    state: "ready",
    components: manifest.items.filter((x) => x.kind === "component").length,
    packages: manifest.packages,
    platforms: manifest.platforms,
    optionalPacks: manifest.optionalPacks,
  });
  process.exit(0);
}
const at = args.indexOf("--framework"),
  framework = at < 0 ? undefined : args[at + 1];
if (at >= 0) args.splice(at, 2);
if (!framework)
  fail("invalid", "Specify --framework vue or --framework react; APIs differ.");
if (!["vue", "react"].includes(framework))
  fail(
    "unavailable",
    `No direct ${framework} adapter.`,
    { platform: manifest.platforms[framework] ?? null },
    3,
  );
if (args.some((x) => x.startsWith("--"))) fail("invalid", "Unknown argument");
const query = args.join(" ").trim(),
  items = manifest.items.filter((x) => x.framework === framework);
if (command === "list") {
  if (query) fail("invalid", "list takes no query");
  output({
    state: "matched",
    framework,
    items: items
      .filter((x) => x.kind === "component")
      .map(({ id, name, purpose }) => ({ id, name, purpose })),
  });
  process.exit(0);
}
if (!query) fail("invalid", `${command} needs a query`);
if (command === "show") {
  const item = items.find((x) => x.name === query || x.id === query);
  if (!item)
    fail(
      "unavailable",
      `${framework}:${query} is not exported.`,
      {
        related: manifest.items
          .filter((x) => x.name === query)
          .map((x) => x.id),
      },
      3,
    );
  output({ state: "matched", package: manifest.packages[framework], item });
  process.exit(0);
}
const words = query.toLowerCase().split(/\s+/),
  matches = items.filter(
    (item) =>
      item.kind === "component" &&
      words.every((word) =>
        [item.name, item.purpose, ...item.keywords]
          .join(" ")
          .toLowerCase()
          .includes(word),
      ),
  );
if (!matches.length)
  fail(
    "unavailable",
    "No matching component. Try another term or inspect the framework list.",
    { framework, query },
    3,
  );
output({
  state: "matched",
  framework,
  items: matches.map(({ id, name, purpose, source, examples, limits }) => ({
    id,
    name,
    purpose,
    source,
    examples,
    limits,
  })),
});

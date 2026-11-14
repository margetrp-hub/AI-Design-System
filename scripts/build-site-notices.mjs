import { mkdirSync, readFileSync, copyFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// The workshop bundles font binaries, so ship their actual copyright/OFL files
// with the static site as well as preserving the package dependency notices.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const destination = path.join(root, "dist/catalog/licenses");
const ui = JSON.parse(readFileSync(path.join(root, "packages/ui/package.json"), "utf8"));
const fonts = Object.keys(ui.dependencies).filter((name) => name.startsWith("@fontsource"));
mkdirSync(destination, { recursive: true });
copyFileSync(path.join(root, "LICENSE"), path.join(destination, "MIT.txt"));
copyFileSync(path.join(root, "packages/styles/THIRD_PARTY_NOTICES.md"), path.join(destination, "third-party.txt"));
const links = fonts.map((name) => {
  const filename = name.split("/")[1] + ".txt";
  copyFileSync(path.join(root, "node_modules", name, "LICENSE"), path.join(destination, filename));
  return `<li><a href="${filename}">${name} ${ui.dependencies[name]}</a></li>`;
});
writeFileSync(path.join(destination, "index.html"), `<!doctype html>
<html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>AI Design System — licenses</title><body>
<h1>AI Design System licenses</h1>
<p><a href="../">Return to the workshop</a></p>
<ul><li><a href="MIT.txt">Original code — MIT</a></li>
<li><a href="third-party.txt">Magic UI adaptation notice</a></li>${links.join("\n")}</ul>
</body></html>\n`);
console.log(`Included ${fonts.length} font copyright/OFL files and project notices in the static site.`);

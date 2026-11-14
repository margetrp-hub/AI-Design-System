import ts from "typescript";
import { parse } from "@vue/compiler-sfc";
import { createHash } from "node:crypto";
import {
  existsSync,
  readFileSync,
  readdirSync,
  mkdirSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  usage,
  limits,
  nativeElements,
  platforms,
} from "../registry/usage.mjs";

export const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
export const manifestPath = path.join(root, "registry/manifest.json");
const slash = (value) => value.replaceAll("\\", "/");
const relative = (value) => slash(path.relative(root, value));
const read = (file) => readFileSync(path.resolve(root, file), "utf8").replaceAll("\r\n", "\n");
const json = (file) => JSON.parse(read(file));
export function inputHashes() {
  const files = [];
  function walk(dir) {
    for (const item of readdirSync(path.join(root, dir), {
      withFileTypes: true,
    })) {
      if (["node_modules", "dist"].includes(item.name)) continue;
      const file = slash(path.join(dir, item.name));
      if (item.isDirectory()) walk(file);
      else if (/\.(vue|tsx?|m?js|css|json|html|md)$/.test(file))
        files.push(file);
    }
  }
  for (const dir of ["packages", "examples", "apps/catalog/src"])
    if (existsSync(path.join(root, dir))) walk(dir);
  files.push("registry/usage.mjs", "registry/tasks.json", "scripts/build-registry.mjs");
  return Object.fromEntries(
    files
      .sort()
      .map((file) => [
        file,
        createHash("sha256").update(read(file)).digest("hex"),
      ]),
  );
}
const options = {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  strict: true,
  skipLibCheck: true,
  jsx: ts.JsxEmit.ReactJSX,
};
const frameworkDefs = {
  vue: ["packages/ui", "packages/ui/src/index.ts"],
  react: ["packages/react", "packages/react/src/index.tsx"],
};
const flags =
  ts.TypeFormatFlags.NoTruncation |
  ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope;

export function buildManifest() {
  const items = [],
    packages = {};
  for (const [framework, [dir, entry]] of Object.entries(frameworkDefs)) {
    const pkg = json(`${dir}/package.json`),
      declaration = `${dir}/dist/index.d.ts`;
    if (!existsSync(path.join(root, declaration)))
      throw Error(`Missing ${declaration}; run npm run build:registry`);
    packages[framework] = {
      name: pkg.name,
      version: pkg.version,
      dependencies: pkg.dependencies ?? {},
      peerDependencies: pkg.peerDependencies ?? {},
      styles: `${pkg.name}/style.css`,
      ...(framework === "vue"
        ? { optionalFonts: `${pkg.name}/fonts.css` }
        : {}),
    };
    const program = ts.createProgram([path.join(root, declaration)], options),
      checker = program.getTypeChecker();
    const source = program.getSourceFile(path.join(root, declaration)),
      module = checker.getSymbolAtLocation(source);
    const textOf = (type) =>
      checker
        .typeToString(type, undefined, flags)
        .replaceAll(slash(root) + "/", "");
    const properties = (type, filter = () => true) =>
      type
        ? checker
            .getPropertiesOfType(type)
            .filter(filter)
            .map((symbol) => ({
              name: symbol.name,
              required: !(symbol.flags & ts.SymbolFlags.Optional),
              type: textOf(
                checker.getTypeOfSymbolAtLocation(
                  symbol,
                  symbol.valueDeclaration ?? symbol.declarations?.[0] ?? source,
                ),
              ),
            }))
            .sort((a, b) => a.name.localeCompare(b.name))
        : [];
    const propertyType = (type, name) => {
      const symbol = type?.getProperty(name);
      return (
        symbol &&
        checker.getTypeOfSymbolAtLocation(
          symbol,
          symbol.valueDeclaration ?? symbol.declarations?.[0] ?? source,
        )
      );
    };
    for (const exported of checker
      .getExportsOfModule(module)
      .sort((a, b) => a.name.localeCompare(b.name))) {
      const symbol =
        exported.flags & ts.SymbolFlags.Alias
          ? checker.getAliasedSymbol(exported)
          : exported;
      const name = exported.name,
        type = checker.getTypeOfSymbolAtLocation(
          symbol,
          symbol.valueDeclaration ?? symbol.declarations?.[0] ?? source,
        );
      const isValue = !!(symbol.flags & ts.SymbolFlags.Value),
        component = /^Ui[A-Z]/.test(name) && isValue;
      const declarationFile = relative(
        symbol.declarations?.[0]?.getSourceFile().fileName ??
          path.join(root, declaration),
      );
      const sourceFile = component
        ? framework === "vue"
          ? `${dir}/src/${name}.vue`
          : declarationFile
              .replace("/dist/", "/src/")
              .replace(/\.d\.ts$/, ".tsx")
        : entry;
      let props = [],
        events = [],
        slots = [],
        nativeProps,
        defaults = {},
        models = [];
      if (component) {
        if (!usage[name])
          throw Error(
            `Add purpose/keywords for ${framework}:${name} in registry/usage.mjs`,
          );
        if (framework === "vue") {
          const ctor = type.getConstructSignatures()[0],
            call = type.getCallSignatures()[0];
          const instance = ctor && checker.getReturnTypeOfSignature(ctor);
          const propsType = instance
            ? propertyType(instance, "$props")
            : call &&
              checker.getTypeOfSymbolAtLocation(
                call.parameters[0],
                call.parameters[0].valueDeclaration,
              );
          props = properties(
            propsType,
            (s) =>
              !["key", "ref", "ref_for", "ref_key", "class", "style"].includes(
                s.name,
              ) && !s.name.startsWith("onVnode"),
          );
          events = props
            .filter((p) => /^on[A-Z]|^onUpdate:/.test(p.name))
            .map((p) => ({
              name: p.name.startsWith("onUpdate:")
                ? "update:" + p.name.slice(9)
                : p.name.slice(2, 3).toLowerCase() + p.name.slice(3),
              type: p.type,
            }));
          props = props.filter((p) => !/^on[A-Z]|^onUpdate:/.test(p.name));
          let slotType = instance && propertyType(instance, "$slots");
          if (!slotType && call) {
            const ctx = propertyType(
              checker.getReturnTypeOfSignature(call),
              "__ctx",
            );
            if (ctx)
              slotType = propertyType(checker.getNonNullableType(ctx), "slots");
          }
          slots = properties(slotType);
          if (
            /<slot\b[^>]*:name=/.test(read(sourceFile)) &&
            slotType &&
            checker.getIndexTypeOfType(slotType, ts.IndexKind.String)
          )
            slots.push({
              name: "[dynamic name]",
              required: false,
              type: textOf(
                checker.getIndexTypeOfType(slotType, ts.IndexKind.String),
              ),
            });
          const { descriptor } = parse(read(sourceFile)),
            script = ts.createSourceFile(
              sourceFile + ".ts",
              descriptor.scriptSetup?.content ?? "",
              ts.ScriptTarget.Latest,
              true,
              ts.ScriptKind.TS,
            );
          const members = (node) =>
            node && ts.isObjectLiteralExpression(node)
              ? Object.fromEntries(
                  node.properties
                    .filter(ts.isPropertyAssignment)
                    .map((p) => [
                      p.name.getText(script).replace(/^['"]|['"]$/g, ""),
                      p.initializer.getText(script),
                    ]),
                )
              : {};
          function visit(node) {
            if (ts.isCallExpression(node)) {
              if (node.expression.getText(script) === "withDefaults")
                Object.assign(defaults, members(node.arguments[1]));
              if (node.expression.getText(script) === "defineModel") {
                const named =
                    node.arguments[0] && ts.isStringLiteral(node.arguments[0]),
                  key = named ? node.arguments[0].text : "modelValue",
                  config = members(node.arguments[named ? 1 : 0]);
                models.push({ prop: key, event: `update:${key}` });
                if (config.default !== undefined)
                  defaults[key] = config.default;
              }
            }
            ts.forEachChild(node, visit);
          }
          visit(script);
        } else {
          const call = type.getCallSignatures()[0],
            propsType = checker.getTypeOfSymbolAtLocation(
              call.parameters[0],
              call.parameters[0].valueDeclaration ?? source,
            );
          props = properties(propsType, (s) =>
            (s.declarations ?? []).some((d) =>
              relative(d.getSourceFile().fileName).startsWith(
                "packages/react/",
              ),
            ),
          );
          if (nativeElements[name])
            nativeProps = `React.ComponentPropsWithoutRef<'${nativeElements[name]}'>; native attributes are accepted; see source for owned style/keyboard behavior. Ref forwarding only on UiButton, UiInput, UiTextarea, UiSurface and UiTable.`;
        }
      }
      items.push({
        id: `${framework}:${name}`,
        framework,
        name,
        kind: component ? "component" : isValue ? "utility" : "type",
        package: pkg.name,
        version: pkg.version,
        source: sourceFile,
        declaration: declarationFile,
        ...(component
          ? {
              ...usage[name],
              ...(framework === "react" &&
              ["UiInput", "UiTextarea"].includes(name)
                ? {
                    purpose:
                      "原生" +
                      nativeElements[name] +
                      "样式；标签和校验由宿主提供",
                  }
                : {}),
              props,
              events,
              slots,
              defaults,
              models,
              ...(nativeProps ? { nativeProps } : {}),
              limits: limits[framework][name] ?? [],
              examples: [],
            }
          : {
              signatures: !isValue
                ? []
                : type
                    .getCallSignatures()
                    .map((s) => checker.signatureToString(s, undefined, flags)),
              purpose: name,
            }),
      });
    }
  }
  const exampleFiles = [
    "examples/vue/App.vue",
    "examples/react/App.tsx",
    "examples/react/TaskExample.tsx",
    "apps/catalog/src/ComponentExamples.vue",
    "apps/catalog/src/AdditionalExamples.vue",
    "apps/catalog/src/MotionExamples.vue",
    "apps/catalog/src/DesignComposer.vue",
    "apps/catalog/src/ColorExamples.vue",
    "apps/catalog/src/AssetExamples.vue",
    "apps/catalog/src/AiExamples.vue",
    "apps/catalog/src/TaskLogExamples.vue",
    "apps/catalog/src/StudioExamples.vue",
  ];
  for (const file of exampleFiles)
    if (existsSync(path.join(root, file))) {
      const content = read(file),
        framework = file.endsWith(".tsx") ? "react" : "vue";
      for (const item of items)
        if (
          item.framework === framework &&
          item.kind === "component" &&
          new RegExp(`\\b${item.name}\\b`).test(content)
        )
          item.examples.push(file);
    }
  const optionalPacks = [];
  for (const task of json("registry/tasks.json").tasks) {
    for (const framework of task.frameworks) {
      for (const name of task.components) {
        if (!items.some(item => item.kind === "component" && item.framework === framework && item.name === name))
          throw Error(`Task ${task.id} references unavailable ${framework}:${name}`);
      }
    }
  }
  return {
    schemaVersion: 1,
    generatedBy: "npm run build:registry",
    packages,
    platforms,
    optionalPacks,
    usageGuide: "docs/ai.md",
    inputs: inputHashes(),
    items,
  };
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    const generated = JSON.stringify(buildManifest(), null, 2) + "\n";
    if (process.argv.includes("--check")) {
      if (
        !existsSync(manifestPath) ||
        readFileSync(manifestPath, "utf8") !== generated
      )
        throw Error(
          "Registry is stale. Run npm run build:registry, review the API changes, then run npm run check.",
        );
      console.log(
        "Registry matches current exports, declarations, examples and source fingerprints.",
      );
    } else {
      mkdirSync(path.dirname(manifestPath), { recursive: true });
      writeFileSync(manifestPath, generated);
      console.log("Generated registry/manifest.json");
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

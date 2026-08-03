/* global __dirname */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const BASELINE_PATH = path.join(ROOT, ".structure-baseline.json");
const SOURCE_DIRS = [
  "components",
  "config",
  "constants",
  "data",
  "features",
  "hooks",
  "lib",
  "navigation",
  "notifications",
  "providers",
  "screens",
  "services",
  "store",
  "types",
  "utils",
];
const SHARED_DIRS = [
  "components",
  "features",
  "hooks",
  "lib",
  "providers",
  "services",
  "store",
  "utils",
];
const FILE_SIZE_EXCLUSIONS = new Set([
  "data/country_and_states.ts",
  "types/globals.d.ts",
]);

function collectFiles(directory) {
  if (!fs.existsSync(directory)) return [];

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectFiles(entryPath);
    return /\.(?:ts|tsx)$/.test(entry.name) ? [entryPath] : [];
  });
}

function relative(filePath) {
  return path.relative(ROOT, filePath).split(path.sep).join("/");
}

function inspectRepository() {
  const files = SOURCE_DIRS.flatMap((directory) =>
    collectFiles(path.join(ROOT, directory)),
  );
  const findings = {
    oversizedFiles: {},
    parentRelativeImports: [],
    legacyNames: [],
    serviceTsxFiles: [],
    screenDependencies: [],
    directAssetImports: [],
  };

  for (const file of files) {
    const filePath = relative(file);
    const content = fs.readFileSync(file, "utf8");
    const lines = content.split(/\r?\n/);

    if (lines.length > 300 && !FILE_SIZE_EXCLUSIONS.has(filePath)) {
      findings.oversizedFiles[filePath] = lines.length;
    }
    if (/\/(?:utils_.*|.*_input_.*)\.(?:ts|tsx)$/.test(`/${filePath}`)) {
      findings.legacyNames.push(filePath);
    }
    if (filePath.startsWith("services/") && filePath.endsWith(".tsx")) {
      findings.serviceTsxFiles.push(filePath);
    }

    lines.forEach((line, index) => {
      const location = `${filePath}:${index + 1}`;
      if (/\b(?:from\s+|require\()["']\.\.\//.test(line)) {
        findings.parentRelativeImports.push(filePath);
      }
      if (
        SHARED_DIRS.some((directory) => filePath.startsWith(`${directory}/`)) &&
        /["']#screens\//.test(line)
      ) {
        findings.screenDependencies.push(location);
      }
      if (
        /^(?:screens|components)\//.test(filePath) &&
        /["'](?:#assets\/|(?:(?:\.\.\/|\.\/)+)assets\/)/.test(line)
      ) {
        findings.directAssetImports.push(location);
      }
    });
  }

  findings.parentRelativeImports = [...new Set(findings.parentRelativeImports)];
  findings.legacyNames.sort();
  findings.serviceTsxFiles.sort();
  findings.screenDependencies.sort();
  findings.directAssetImports.sort();
  return findings;
}

function writeBaseline(findings) {
  fs.writeFileSync(BASELINE_PATH, `${JSON.stringify(findings, null, 2)}\n`);
  console.log(`Wrote ${relative(BASELINE_PATH)}`);
}

function compareList(name, current, baseline, errors) {
  const allowed = new Set(baseline ?? []);
  const additions = current.filter((item) => !allowed.has(item));
  if (additions.length > 0) {
    errors.push(`${name}:\n  ${additions.join("\n  ")}`);
  }
}

function main() {
  const findings = inspectRepository();
  if (process.argv.includes("--write-baseline")) {
    writeBaseline(findings);
    return;
  }

  if (!fs.existsSync(BASELINE_PATH)) {
    console.error("Missing .structure-baseline.json. Run with --write-baseline.");
    process.exit(1);
  }

  const baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, "utf8"));
  const errors = [];
  const oversizedAdditions = Object.entries(findings.oversizedFiles).filter(
    ([file, lines]) => !baseline.oversizedFiles?.[file] || lines > baseline.oversizedFiles[file],
  );
  if (oversizedAdditions.length > 0) {
    errors.push(
      `Oversized files:\n  ${oversizedAdditions
        .map(([file, lines]) => `${file} (${lines} lines)`)
        .join("\n  ")}`,
    );
  }

  compareList(
    "Parent-relative imports",
    findings.parentRelativeImports,
    baseline.parentRelativeImports,
    errors,
  );
  compareList("Legacy filenames", findings.legacyNames, baseline.legacyNames, errors);
  compareList(
    "TSX files in services",
    findings.serviceTsxFiles,
    baseline.serviceTsxFiles,
    errors,
  );
  compareList(
    "Shared modules importing screens",
    findings.screenDependencies,
    [],
    errors,
  );
  compareList(
    "Direct asset imports in UI",
    findings.directAssetImports,
    [],
    errors,
  );

  if (errors.length > 0) {
    console.error(`Structure check failed:\n\n${errors.join("\n\n")}`);
    process.exit(1);
  }

  console.log("Structure check passed.");
}

main();

const TypeDoc = require("typedoc");
const fs = require("fs");
const path = require("path");
const process = require("process");
const { commentAnalyzer } = require("./comment-analyzer");

async function generateTypedocAndAnalyze(entryPoint) {
    const app = await TypeDoc.Application.bootstrapWithPlugins(
        {
            entryPoints: [entryPoint],
            compilerOptions: {
                skipLibCheck: true,
            },
            excludeInternal: true,
        },
        []
    );
    console.log("Converting...");
    const project = await app.convert();
    console.log("Converting, generating JSON...");
    if (project) {
        const outputDir = "tmp";
        await app.generateJson(project, `${outputDir}/typedoc.json`);

        const data = JSON.parse(fs.readFileSync(`${outputDir}/typedoc.json`, "utf8"));
        console.log("Analyzing...");
        commentAnalyzer(data);
    }
}

async function runOnDir(sourceFolder) {
    const indexFileName = "index.d.ts";
    const indexFilePath = path.join(sourceFolder, indexFileName);

    if (fs.existsSync(indexFilePath)) {
        await generateTypedocAndAnalyze(indexFilePath);
    } else {
        console.log(indexFilePath, "file not found in the source folder.");
    }
}

const envVariableName = "TYPEDOC_ANALYSIS_SOURCE_FOLDER";

async function main() {
    const envVariable = process.env[envVariableName];
    const dirList = [envVariable ?? "./packages/public/@babylonjs/core/"];

    if (!fs.existsSync("tmp")) {
        fs.mkdirSync("tmp");
    }

    for (const dir of dirList) {
        console.log(`Running analysis on ${dir}`);
        await runOnDir(dir);
    }
    console.log("Done. Removing tmp folder.");
    fs.rmSync("tmp", { recursive: true, force: true });
}

main().catch(console.error);

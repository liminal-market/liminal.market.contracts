/**
 * @type {ICodeNarratorConfig}
 */
const config = {
    entry_file: "",
    cli_file: "",
    project_name: "liminal.market.contracts",
    config_files: ["hardhat.config.ts", "package.json", "slither.config.json"],
    repository_url: "",
    project_file: "package.json",
    source_path: "contracts",
    documentation_path: "./docs",
    test_path: "test",
    gptModel: "gpt-4",
    readmeRoot: true,
    include: ["hardhat.config.ts", "package.json", "slither.config.json", "contracts/**/*", "test/**/*", "scripts/**/*"],
    exclude: ["node_modules", ".env", ".openzeppelin", "coverage", "coverage.json", "typechain", "#Hardhat files", "cache", "artifacts", "typechain-types", "/.idea/", "/.nyc_output", "/truffle-config.js", "/keys.txt", ".run", "/node_modules", "/.idea", "/.git", ".gitignore", "/.code-narrator", "/dist", "/build", "package-lock.json"],
    builders: [{
        name: "README",
        type: "README",
        template: "README",
        sidebarPosition: 1,
        args: {entryFileContent: "content(package.json)"}
    }, {
        name: "HowTo Overview",
        type: "README",
        template: "overview_readme",
        path: "howto",
        files: [{path: "howto/*.md"}],
        pages: [
            {
                name: "HowTo Example",
                type: "howto",
                template: "howto_create_howto"
            }]
    }]
}
module.exports = config;

"use strict"
const file = require('../util/fileExtension');
var path = require('path');
const cwd = process.cwd();
const { execSync } = require('child_process');

function copyManifest(projectPath, runner) {
    file.copyFile(path.join(cwd,"data", "manifest/manifest-" + runner + ".json"), path.join(projectPath, "manifest.json"))
}

function prerequisite(projectPath, runner) {
    if (runner == "ruby") {
        var output = execSync('gauge version -m');
        var version = JSON.parse(output.toString()).plugins.find(p => p.name == "ruby").version;
        var gemFilePath = path.join(projectPath, "Gemfile");
        console.log(projectPath)
        var fileContent = file.parseContent(gemFilePath);
        var result = fileContent.replace(/\${ruby-version}/, version);
        file.write(gemFilePath, result);
        var vendorFolderPath = path.join(process.cwd(), "data", "vendor");
        execSync('bundle install --path ' + vendorFolderPath, { encoding: 'utf8', cwd: projectPath });
    }
}

module.exports = {
    copyManifest:copyManifest,
    prerequisite:prerequisite
} 
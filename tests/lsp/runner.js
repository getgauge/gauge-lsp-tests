"use strict"
const file = require('../util/fileExtension');
var path = require('path');

function copyManifest(projectPath, runner) {
    file.copyFile(path.join("data", "manifest/manifest-" + runner + ".json"), path.join(projectPath, "manifest.json"))
}

function bundleInstall(projectPath, runner) {
    if (runner == "ruby") {
        var output = execSync('gauge version -m');
        var version = JSON.parse(output.toString()).plugins.find(p => p.name == "ruby").version;
        var gemFilePath = file.getPath(path.join(projectPath, "Gemfile"));
        var fileContent = file.parseContent(gemFilePath);
        var result = fileContent.replace(/\${ruby-version}/, version);
        file.write(gemFilePath, result);
        var vendorFolderPath = path.join(process.cwd(), "data", "vendor");
        execSync('bundle install --path ' + vendorFolderPath, { encoding: 'utf8', cwd: file.getPath(projectPath) });
    }
}

module.exports = {
    copyManifest:copyManifest,
    bundleInstall:bundleInstall
}
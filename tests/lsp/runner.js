"use strict"
const file = require('../util/fileExtension');
var path = require('path');
const cwd = process.cwd();
const { execSync } = require('child_process');

function copyManifest(projectPath, runner) {
    file.copyFile(path.join(cwd,"data", "manifest/manifest-" + runner + ".json"), path.join(projectPath, "manifest.json"))
}

function prerequisite(projectPath, runner) {
    if (runner === "ruby") {
        var output = execSync('gauge version -m');
        var version = JSON.parse(output.toString()).plugins.find(p => p.name === "ruby").version;
        var gemFilePath = path.join(projectPath, "Gemfile");
        var fileContent = file.parseContent(gemFilePath);
        var newContent;
        if (process.env.LOCAL_RUBY_PLUGIN_PATH) {
            newContent = `gem 'gauge-ruby', '~>${version}', :path => '${process.env.LOCAL_RUBY_PLUGIN_PATH}', :group => [:development, :test]`;
        } else {
            newContent = `gem 'gauge-ruby', '~>${version}', :github => ENV['GITHUB_REPOSITORY'] || 'getgauge/gauge-ruby', :branch => ENV['RUBY_PLUGIN_BRANCH'] || 'master', :group => [:development, :test]`;
        }
        var result = fileContent.replace(/gem 'gauge-ruby'.*:group => \[:development, :test\]/, newContent);
        if (process.env.RUBY_PLUGIN_GRPC_SOURCE_BRANCH) {
            result += `\n    gem 'grpc', :github => 'grpc/grpc', :branch => '${process.env.RUBY_PLUGIN_GRPC_SOURCE_BRANCH}', :submodules => true, :group => [:development, :test]\n`;
        }
        file.write(gemFilePath, result);
        var vendorFolderPath = path.join(process.cwd(), "data", "vendor");
        execSync('bundle config set --local path ' + vendorFolderPath, { encoding: 'utf8', cwd: projectPath });
        execSync('bundle install', { encoding: 'utf8', cwd: projectPath });
    }
}

module.exports = {
    copyManifest:copyManifest,
    prerequisite:prerequisite
} 
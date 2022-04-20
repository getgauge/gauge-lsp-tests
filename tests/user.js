var fs = require("fs");
var fse = require("fs-extra");
var os = require("os");
var file = require("./util/fileExtension");
var path = require("path");
var tmpDir;

function copyDataToDir(data, projectDir) {
  fse.copySync(data, projectDir);
}

function createTempDirectory() {
  tmpDir = fs.mkdtempSync(
    path.join(fs.realpathSync.native(os.tmpdir()), "gauge-lsp-test")
  );
  return tmpDir;
}

function getProjectDirectory() {
  return tmpDir;
}

function removeCallback() {
  if (tmpDir) {
    tmpDir.removeCallback();
  }
}

function removeTempDirectory() {
  if (tmpDir) file.rmDir(tmpDir);
}

module.exports = {
  createTempDirectory: createTempDirectory,
  copyDataToDir: copyDataToDir,
  getProjectDirectory: getProjectDirectory,
  removeTempDirectory: removeTempDirectory,
  removeCallBack: removeCallback
};

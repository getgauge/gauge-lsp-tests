const _fileExtension = require("./util/fileExtension");
const _customLSP = require("./lsp/customLSP");
const _assert = require("assert");
const _path = require("path");
step("generate concept <name> in new file under <path> and verify", async function (name, relativePath) {
  var response = await _customLSP.generateNewConcept(name, relativePath);
  var conceptFile = _fileExtension.getUri(_customLSP.conceptFilePath(relativePath));
  _assert.ok(response.changes[conceptFile]);
  _assert.equal(response.changes[conceptFile][0].newText, _customLSP.conceptTemplate(name));
});

step("generate concept <name> in file <fileName> of <filePath> and verify", async function (name, fileName, filePath) {
  var response = await _customLSP.generateInExistingConcept(name, fileName, filePath);
  var conceptFile = _fileExtension.getUri(_customLSP.conceptFilePath(filePath, fileName));
  _assert.ok(response.changes[conceptFile]);
  _assert.equal(response.changes[conceptFile][0].newText, _customLSP.conceptTemplate(name));
});

step("get implementation files", async function () {
  var files = await _customLSP.getImplFiles();
  _assert.ok(files.length >= 1);
});

step("generate new step definition <code> in existing file", async function (code) {
  var files = await _customLSP.getImplFiles();

  var result = await _customLSP.putStubImpl(files[0],code);
  var fileURI = _fileExtension.getUri(files[0]);
  var changesForFile = result.changes[fileURI];
  _assert.ok(changesForFile!=null);

  var changes = changesForFile.filter(function (elem) {
    return elem.newText.endsWith(code);
  });
  _assert.ok(changes.length>0);
});

step("generate new step definition <code> in new file", async function (code) {
  var files = await _customLSP.getImplFiles();

  var result = await _customLSP.putStubImpl(null,code);
  var dirname = _path.dirname(files[0]);
  var extension = _path.extname(files[0]);
  var basename = _path.basename(files[0],extension);

  var fileURI = _fileExtension.getUri(_path.join(dirname,basename+"_1"+extension));
  var changesForFile = result.changes[fileURI];
  _assert.ok(changesForFile!=null);

  var changes = changesForFile.filter(function (elem) {
    return elem.newText.endsWith(code);
  });
  _assert.ok(changes.length>0);
});
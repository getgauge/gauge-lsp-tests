const _fileExtension = require('./util/fileExtension');
const _customLSP = require('./lsp/customLSP');
const _assert = require('assert');
step('generate concept <name> in new file under <path> and verify', async function (name, relativePath) {
	var response = await _customLSP.generateNewConcept(name, relativePath);
	var conceptFile = _fileExtension.getUri(_customLSP.conceptFilePath(relativePath))
	_assert.ok(response.changes[conceptFile]);
	_assert.equal(response.changes[conceptFile][0].newText, _customLSP.conceptTemplate(name));
});

step("generate concept <name> in file <fileName> of <filePath> and verify", async function (name, fileName, filePath) {
	var response = await _customLSP.generateInExistingConcept(name, fileName, filePath);
	var conceptFile = _fileExtension.getUri(_customLSP.conceptFilePath(filePath, fileName))
	_assert.ok(response.changes[conceptFile]);
	_assert.equal(response.changes[conceptFile][0].newText, _customLSP.conceptTemplate(name));
});

step("get implementation files", async function () {
	var files = await _customLSP.getImplFiles();
	_assert.ok(files.length >= 1);
});

step("generate new step definition <name> in new file", async function(name) {
	var files = await _customLSP.getImplFiles();
	console.log(files[0])
});
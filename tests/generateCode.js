const _fileExtension = require('./util/fileExtension');
const _languageClient = require('./lsp/languageclient');
const _assert = require('assert');
step("delete contents of folder <conceptPath>", async function(conceptPath) {
	_fileExtension.rmContentsOfDir(_fileExtension.getFullPath(conceptPath))
});

step("generate concept <name> in <path>", async function(name, relativePath) {
	var response = await _languageClient.generateNewConcept(name,relativePath)

	_assert.ok(response.changes[_languageClient.newConceptFile(relativePath)])
	_assert.equal(response.changes[_languageClient.newConceptFile(relativePath)][0].newText, _languageClient.conceptTemplate(name))
});
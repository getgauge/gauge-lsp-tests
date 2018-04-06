var languageclient = require('./lsp/languageclient');
var file = require('./util/fileExtension');
var builder = require('./lsp/util/dataBuilder')
var path = require('path')
var assert = require('assert')
step("refactor step <details> for project <project>", async function (jsonDetails, project) {
	var details = builder.loadJSON(jsonDetails)
	var result = await languageclient.refactor(details.input.uri, details.input.position, details.input.newName)
	verifyRefactorResult(details.result, result);
});

function verifyRefactorResult(expected, actual) {
	for (k in expected.changes) {
		var fileUri = file.getUri(languageclient.filePath(k));
		assert.deepEqual(expected.changes[k], actual.changes[fileUri]);
	}
};

step("restore file in project <projectPath> with details <jsonDetails>", async function (projectPath, jsonDetails) {
	var details = builder.loadJSON(jsonDetails)
	restore(details.input.gaugeFile)
	restore(details.input.code);
});

function restore(items){
	if(items!=null){
		file.copyFile(items.forEachfile.getFullPath(projectPath, item.restoreFrom), file.getFullPath(projectPath, item.toBeRestored)())
	}
}
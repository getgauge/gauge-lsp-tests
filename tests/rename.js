var languageclient = require('./lsp/languageclient');
var file = require('./util/fileExtension');
var builder = require('./lsp/util/dataBuilder')
var path = require('path')
var assert = require('assert')
step("refactor step <details>", async function (jsonDetails) {
	var details = builder.loadJSON(jsonDetails)
	var result = await languageclient.refactor(details.input.uri, details.input.position, details.input.newName)
	verifyRefactorResult(details.result, result);
});

function verifyRefactorResult(expectedResults, actualResults) {
	for (k in expectedResults.changes) {
		var fileUri = file.getUri(languageclient.filePath(k));
		var expected = expectedResults.changes[k][0]
		var actual = actualResults.changes[fileUri][0]
		assert.deepEqual(expected.range, actual.range);
		assert.deepEqual(expected.newText, actual.newText,"expected \n"+expected.newText+" but was \n"+actual.newText);
	}
};

step("restore file in project <projectPath> with details <jsonDetails>", async function (projectPath, jsonDetails) {
	var details = builder.loadJSON(jsonDetails)
	restore(projectPath, details.input.gaugeFile)
	restore(projectPath,details.input.code);
});

function restore(projectPath, items){
	if(items!=null){
		items.forEach(function(item){
			file.copyFile(file.getFullPath(projectPath, item.restoreFrom), file.getFullPath(projectPath, item.toBeRestored))
		})
	}
}
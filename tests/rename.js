var languageclient = require('./lsp/languageclient');
var file = require('./util/fileExtension');
var builder = require('./lsp/util/dataBuilder')
var path = require('path')
var assert = require('assert')
var cwd = process.cwd()
step("refactor step <details>", async function (jsonDetails) {
	var details = builder.buildRefactor(jsonDetails)
	var result = await languageclient.refactor(details.input.uri, details.input.position, details.input.newName)
	verifyRefactorResult(details.result, result);
});

function verifyRefactorResult(expectedResults, actualResults) {
	var errList = []
	for (k in expectedResults.changes) {
		var fileUri = file.getUri(languageclient.filePath(k));
		var expectedList = expectedResults.changes[k]
		var actualList = actualResults.changes[fileUri]
		if (actualList == null) {
			errList.push('expected ' + JSON.stringify(expectedList) + ' not in ' + JSON.stringify(actualResults.changes))
			continue
		}
		expectedList.sort(function (a, b) { return a.range.start.line - b.range.start.line });
		actualList.sort(function (a, b) { return a.range.start.line - b.range.start.line });
		for (i = 0; i < actualList.length; i++) {
			var expected = expectedList[i]
			var actual = actualList[i]
			assert.deepEqual(expected.range, actual.range);
			assert.deepEqual(expected.newText, actual.newText, "expected \n" + expected.newText + " but was \n" + actual.newText);
		}
	}
	if (errList.length > 0)
		throw new Error(JSON.stringify(errList))
};
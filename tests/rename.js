var languageclient = require('./lsp/languageclient');
var file = require('./util/fileExtension');
var builder = require('./lsp/util/dataBuilder')
var path = require('path')
var assert = require('assert')
var cwd = process.cwd()
step("refactor step <details>", async function (jsonDetails) {
	var details = builder.loadJSON(jsonDetails)
	var result = await languageclient.refactor(details.input.uri, details.input.position, details.input.newName)
	verifyRefactorResult(details.result, result);
});

function verifyRefactorResult(expectedResults, actualResults) {
	for (k in expectedResults.changes) {
		var fileUri = file.getUri(languageclient.filePath(k));
		var expectedList = expectedResults.changes[k]
		var actualList = actualResults.changes[fileUri]

		for(i=0;i<actualList.length;i++){
			var expected = expectedList[i]
			var actual = actualList[i]

			if(expected==null)
			{
				console.log(JSON.stringify(actualList[i]))
				continue
			}
			assert.deepEqual(expected.range, actual.range);
			assert.deepEqual(expected.newText, actual.newText, "expected \n" + expected.newText + " but was \n" + actual.newText);	
		}
	}

};
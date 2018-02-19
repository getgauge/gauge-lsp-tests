var languageclient = require('./lsp/languageclient');
var file = require('./util/fileExtension');
var builder = require('./lsp/util/dataBuilder')
var path = require('path')
var assert = require('assert')
step("refactor step <details> for project <project>", async function(jsonDetails,project) {
	var details = builder.loadJSON(jsonDetails)
	var result = await languageclient.refactor(details.input.uri,details.input.position,details.input.newName)
	verifyRefactorResult(details.result,result);
});

function verifyRefactorResult(expected,actual) {
	var expected = Object.values(expected.changes);
	var actual = Object.values(actual.changes);

	for(var i=0;i<expected.length;i++){
		assert.deepEqual(expected[i], actual[i],"expected "+JSON.stringify(expected[i])+
		" but was "+JSON.stringify(actual[i]));
	}
};

step("restore file in project <projectPath> with details <jsonDetails>", async function(projectPath,jsonDetails) {
	var details = builder.loadJSON(jsonDetails)
	file.copyFile(file.getFullPath(projectPath,details.input.spec.restoreFrom), file.getFullPath(projectPath,details.input.spec.toBeRestored))	
	file.copyFile(file.getFullPath(projectPath,details.input.code.restoreFrom), file.getFullPath(projectPath,details.input.code.toBeRestored))	
});
const _customLSP = require('./lsp/customLSP');
const _assert = require('assert');
step("verify gauge runner", async function() {
	response = await _customLSP.getRunnerLanguage();
	console.log(response)
	var language = process.env.language;

	if(language=='dotnet')
		_assert.equal(response,'csharp')
	else
		_assert.equal(response,process.env.language)
});
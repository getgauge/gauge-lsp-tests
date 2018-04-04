const _customLSP = require('./lsp/customLSP');
const _assert = require('assert');
step("verify gauge runner", async function() {
	response = await _customLSP.getRunnerLanguage();
	_assert.equal(response,process.env.language)
});
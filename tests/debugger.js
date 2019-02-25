const _customLSP = require("./lsp/customLSP");
const _assert = require("assert");
step("verify gauge runner with call gauge/getRunnerLanguage", async function () {
  var response = await _customLSP.getRunnerLanguage();
  var language = process.env.language;

  if(language=="dotnet")
    _assert.equal(response,"csharp");
  else
    _assert.equal(response,process.env.language);
});
const _assert = require('assert')
const _languageClient = require('./lsp/languageclient');
step('the document Symbols on file <file> should be <symbols>', async function (relativeFilePath, symbols) {
    var result = await _languageClient.documentSymbol(relativeFilePath);
    var symbolList = JSON.parse(symbols)
    _assert.equal(result.length,symbolList.length)
    _assert.deepEqual(result,symbolList)
});

step("the workspace symbols <symbol> shoud be <symbols>", async function(symbol, symbols) {
    var result = await _languageClient.workspaceSymbol({"query":"\""+symbol+"\""});
    var symbolList = JSON.parse(symbols)
    _assert.equal(result.length,symbolList.length)
    _assert.deepEqual(result,symbolList)
});
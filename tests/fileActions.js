var assert = require('assert');
var file = require('./util/fileExtension');
var languageclient = require('./lsp/languageclient');
var builder = require('./lsp/util/dataBuilder');
step('open file <relativeFilePath>', async function (relativeFilePath) {
    try {
        languageclient.openFile(relativeFilePath);
    } catch (err) {
        throw new Error('unable to open file ' + err);
    }
});
step('open file <relativeFilePath> with content <content>', async function (relativeFilePath, beforeFormatFile) {
    try {
        languageclient.openFile(relativeFilePath, beforeFormatFile);
    } catch (err) {
        throw new Error('unable to open file ' + err);
    }
});
function handleCodeLensDetails(responseMessage, expectedDetails) {
    for (var rowIndex = 0; rowIndex < expectedDetails.length; rowIndex++) {
        var expectedDetail = expectedDetails[rowIndex];
        gauge.message('verify code lens details');
        assert.deepEqual(responseMessage[rowIndex].range, expectedDetail.range);
    }
}
step('open file with details <jsonDetails>', function (jsonDetails) {
    var details = builder.loadJSON(jsonDetails);
    try {
        languageclient.openFile(details.input.uri);
    } catch (err) {
        throw new Error('unable to open file ' + err);
    }
});
step('edit file content <arg0> to <arg1> and save', async function (relativeFilePath, contentFile) {
    try {
        languageclient.editFile(relativeFilePath, contentFile);
        var filePath = languageclient.filePath(relativeFilePath)
        var contentFilePath = languageclient.filePath(contentFile)
        file.save(filePath,contentFilePath)
        console.log("\n"+file.parseContent(filePath))
        languageclient.saveFile(relativeFilePath);
    } catch (err) {
        throw new Error('unable to open file ' + err);
    }
});

step('restore file <arg0> with content <arg1>', async function (relativeFilePath, contentFile) {
    try {
        var filePath = languageclient.filePath(relativeFilePath)
        var contentFilePath = languageclient.filePath(contentFile)
        file.save(filePath,contentFilePath)
    } catch (err) {
        throw new Error('unable to open file ' + err);
    }
});

step("print file content <filePath>", async function(filePath) {
	console.log(file.parseContent(filePath))
});
var daemon = require('./lsp/daemon');
var table = require('./util/table');
var file = require('./util/fileExtension');
var notification = require('./lsp/notification');
var path = require('path')

var assert = require('assert');
const rpc = require('vscode-jsonrpc');

var request = require('./lsp/request');
var builder = require('./lsp/util/dataBuilder');

step('open file <relativeFilePath>', async function (relativeFilePath) {
    const filePath = daemon.filePath(relativeFilePath)
    const content = file.parseContent(filePath)
    
    try{
        await notification.openFile(filePath, content, daemon.connection());    
        await daemon.connection().onNotification("textDocument/publishDiagnostics", (res) => {});
    }
    catch(err){
        throw new Error("unable to open file "+err)
    }
});

step('open file <relativeFilePath> with content <content>', async function (relativeFilePath,beforeFormatFile) {
    const filePath = daemon.filePath(relativeFilePath)
    const content = file.parseContent(daemon.filePath(beforeFormatFile))
    
    try{
        await notification.openFile(relativeFilePath,content,daemon.connection());    
        await daemon.connection().onNotification("textDocument/publishDiagnostics", (res) => {});
    }
    catch(err){
        throw new Error("unable to open file "+err)
    }
});

function handleCodeLensDetails(responseMessage,expectedDetails){
for (var rowIndex = 0; rowIndex < expectedDetails.length; rowIndex++) {
  var expectedDetail = expectedDetails[rowIndex]
  gauge.message("verify code lens details")

  assert.deepEqual(responseMessage[rowIndex].range, expectedDetail.range);
}  
}
var assert = require('assert');

var daemon = require('./lsp/daemon');
var file = require('./util/fileExtension');
var languageclient = require('./lsp/languageclient');

step('open file <relativeFilePath>', async function (relativeFilePath) {
    const filePath = daemon.filePath(relativeFilePath)
    const content = file.parseContent(filePath)
    
    try{
        await languageclient.openFile(filePath, content, daemon.connection());    
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
        await languageclient.openFile(relativeFilePath,content,daemon.connection());    
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
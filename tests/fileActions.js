var assert = require('assert');

var file = require('./util/fileExtension');
var languageclient = require('./lsp/languageclient');

step("aaa", async function() {
	throw 'Unimplemented Step';
});

step('open file <relativeFilePath>', async function (relativeFilePath) {    
    try{
        await languageclient.openFile(relativeFilePath);
    }
    catch(err){
        throw new Error("unable to open file "+err)
    }
});

step('open file <relativeFilePath> with content <content>', async function (relativeFilePath,beforeFormatFile) {
    try{
        await languageclient.openFile(relativeFilePath,beforeFormatFile);    
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
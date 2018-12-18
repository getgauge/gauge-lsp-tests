var assert = require('assert');
var file = require('./util/fileExtension');
var languageclient = require('./lsp/languageclient');
var builder = require('./lsp/util/dataBuilder');
step("textDocument/didOpen <relativeFilePath>", function (relativeFilePath) {
    try {
        languageclient.openFile(relativeFilePath);
    } catch (err) {
        console.log(err.stack)
        gauge.message(err.stack)
        throw new Error('unable to open file ' + err);
    }
});
step("textDocument/didOpen <relativeFilePath> with content <content>", function (relativeFilePath, beforeFormatFile) {
    try {
        languageclient.openFile(relativeFilePath, beforeFormatFile);
    } catch (err) {
        console.log(err.stack)
        gauge.message(err.stack)
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
step("textDocument/didOpen details from <jsonDetails>", function (jsonDetails) {
    var details = builder.loadJSON(jsonDetails);
    try {
        languageclient.openFile(details.input.uri);
    } catch (err) {
        console.log(err.stack)
        gauge.message(err.stack)

        throw new Error('unable to open file ' + err);
    }
});
step("simulate user changing content on file system <relativeFilePath> to <contentFile> and saving on disk", function (relativeFilePath, contentFile) { 
        try { 
            var filePath = languageclient.filePath(relativeFilePath) 
            var contentFilePath = languageclient.filePath(contentFile) 
            file.save(filePath,contentFilePath)     
        } catch (err) { 
            console.log(err.stack)
            gauge.message(err.stack)
            throw new Error('unable to save file ' + err); 
    }      
}); 
    
step("textDocument/didChange event to change content from <arg0> to <arg1>", function (relativeFilePath, contentFile) { 
    try { 
            languageclient.editFile(relativeFilePath, contentFile); 
        } catch (err) { 
            console.log(err.stack)
            gauge.message(err.stack)
    
            throw new Error('unable to edit file ' + err); 
    }  
});

step("textDocument/didSave - The document save notification is sent from the client to the server when the document <relativeFilePath> was saved in the client.", function (relativeFilePath) { 
    try { 
            languageclient.saveFile(relativeFilePath); 
        } catch (err) { 
            console.log(err.stack)
            gauge.message(err.stack)
    
            throw new Error('unable to edit file ' + err); 
    }  
});

step("rename file <arg0> to <arg1>", function(fromPath, toPath,done) {
    try { 
        var fileFromPath = languageclient.filePath(fromPath) 
        var fileToPath = languageclient.filePath(toPath) 

        file.rename(fileFromPath,fileToPath,done)
    } catch (err) { 
        console.log(err.stack)
        gauge.message(err.stack)

        throw new Error('unable to rename file ' + err); 
    }  
});
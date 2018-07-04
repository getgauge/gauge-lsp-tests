var assert = require('assert');
var file = require('./util/fileExtension');
var languageclient = require('./lsp/languageclient');
var builder = require('./lsp/util/dataBuilder');
step('open the file <relativeFilePath>', async function (relativeFilePath) {
    try {
        languageclient.openFile(relativeFilePath);
    } catch (err) {
        console.log(err.stack)
        gauge.message(err.stack)
        throw new Error('unable to open file ' + err);
    }
});
step('open the file <relativeFilePath> with content <content>', function (relativeFilePath, beforeFormatFile) {
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
step('open the file with details <jsonDetails>', function (jsonDetails) {
    var details = builder.loadJSON(jsonDetails);
    try {
        languageclient.openFile(details.input.uri);
    } catch (err) {
        console.log(err.stack)
        gauge.message(err.stack)

        throw new Error('unable to open file ' + err);
    }
});
step('change content <relativeFilePath> to <contentFile> and save', async function (relativeFilePath, contentFile) { 
        try { 
            var filePath = languageclient.filePath(relativeFilePath) 
            var contentFilePath = languageclient.filePath(contentFile) 
            file.save(filePath,contentFilePath)     
            console.log("\n"+file.parseContent(filePath)) 
        } catch (err) { 
            console.log(err.stack)
            gauge.message(err.stack)
            throw new Error('unable to save file ' + err); 
    }      
}); 
    
step('edit file content <arg0> to <arg1> and save', async function (relativeFilePath, contentFile) { 
    try { 
            languageclient.editFile(relativeFilePath, contentFile); 
            languageclient.saveFile(relativeFilePath); 
        } catch (err) { 
            console.log(err.stack)
            gauge.message(err.stack)
    
            throw new Error('unable to edit file ' + err); 
    }  
});

step("rename file <arg0> to <arg1>", async function(fromPath, toPath) {
    try { 
        var fileFromPath = languageclient.filePath(fromPath) 
        var fileToPath = languageclient.filePath(toPath) 

        file.rename(fileFromPath,fileToPath)
    } catch (err) { 
        console.log(err.stack)
        gauge.message(err.stack)

        throw new Error('unable to rename file ' + err); 
    }  
});
'use strict';
var assert = require('assert');

var languageclient = require('./lsp/languageclient');
var builder = require('./lsp/util/dataBuilder');

step('ensure code lens has details for <file> <details>', async function (file,details) {
    var expectedDetails = builder.buildExpectedCodeLens(details);  
    
    try{
        var response = await languageclient.codeLens(languageclient.filePath(file))
        handleCodeLensDetails(response,expectedDetails)    
    }
    catch(err){
        throw new Error("unable to verify code lens details "+err)
    }
});

function handleCodeLensDetails(responseMessage,expectedDetails){
    for (var rowIndex = 0; rowIndex < expectedDetails.length; rowIndex++) {
      var expectedDetail = expectedDetails[rowIndex]
      gauge.message("verify code lens details")

      assert.deepEqual(responseMessage[rowIndex].range, expectedDetail.range);
    }  
}
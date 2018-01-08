'use strict';
var assert = require('assert');
const rpc = require('vscode-jsonrpc');

var request = require('./lsp/request');
var table = require('./util/table');
var builder = require('./lsp/util/dataBuilder');
var daemon = require('./lsp/daemon');
var path = require('path');

step('ensure code lens has details for <file> <details>', async function (file,details) {
    var expectedDetails = builder.buildExpectedCodeLens(details);  
    
    try{
        var response = await request.codeLens(path.join(daemon.projectPath() , file),daemon.connection())
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
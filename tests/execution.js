'use strict';
var assert = require('assert');
const rpc = require('vscode-jsonrpc');

var request = require('./lsp/request');
var table = require('./util/table');
var builder = require('./lsp/util/dataBuilder');
var daemon = require('./lsp/daemon');
var path = require('path');

step('ensure code lens has details <details>', async function (details) {
    var currentFilePath = gauge.dataStore.scenarioStore.get('currentFilePath');
    var expectedDetails = builder.buildExpectedCodeLens(details,daemon.projectPath(),currentFilePath);  
    
    try{
        var response = await request.codeLens(path.join(daemon.projectPath() , currentFilePath),daemon.connection())
        handleCodeLensDetails(response,expectedDetails)    
    }
    catch(err){
        assert.fail("error not expected "+err)
    }
});

function handleCodeLensDetails(responseMessage,expectedDetails){
    if(!responseMessage.result)
        return;
    
    for (var rowIndex = 0; rowIndex < expectedDetails.length; rowIndex++) {
      var expectedDetail = expectedDetails[rowIndex]
      assert.deepEqual(responseMessage.result[rowIndex].range, expectedDetail.range);
    }  
}
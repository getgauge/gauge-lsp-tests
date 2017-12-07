'use strict';
var assert = require('assert');
const rpc = require('vscode-jsonrpc');

var notification = require('./lsp/notifications/notification');
var request = require('./lsp/requests/request');
var table = require('./util/table');
var builder = require('./lsp/util/dataBuilder');
var daemon = require('./lsp/daemon');

step('ensure code lens has details <details>', async function (details, done) {
    var currentFilePath = gauge.dataStore.scenarioStore.get('currentFilePath');
    var expectedDetails = await builder.buildExpectedCodeLens(details,daemon.projectPath(),currentFilePath);  
    
    gauge.dataStore.scenarioStore.put('expectedDetails',expectedDetails)
    await request.codeLens(daemon.projectUri() + currentFilePath,daemon.connection())
    daemon.handle(handleCodeLensDetails, done);    
});

async function handleCodeLensDetails(responseMessage,done){
    if(!responseMessage.result)
    return;
    
    console.log("validating codeLens response")
    
    var expectedDetails = gauge.dataStore.scenarioStore.get('expectedDetails')    

    for (var rowIndex = 0; rowIndex < expectedDetails.length; rowIndex++) {
      var expectedDetail = expectedDetails[rowIndex]
      assert.deepEqual(responseMessage.result[rowIndex].range, expectedDetail.range);
    }  
}
"use strict";

const rpc = require('vscode-jsonrpc');
var daemon = require('./lsp/daemon');
var notification = require('./lsp/notifications/notification');
var request = require('./lsp/requests/request');
var table = require('./util/table');
var assert = require('assert');
var builder = require('./lsp/util/dataBuilder');
var path = require('path');


async function handleDiagnosticsResponse(responseMessage) {  
  
  var expectedDiagnostics =gauge.dataStore.scenarioStore.get('expectedDiagnostics');
  var responseUri = builder.getResponseUri(responseMessage.params.uri)
  
  for (var rowIndex = 0; rowIndex < expectedDiagnostics.length; rowIndex++) {
    var expectedDiagnostic = expectedDiagnostics[rowIndex]
    var diagnostic = responseMessage.params.diagnostics[rowIndex];
    
    if(responseUri!=expectedDiagnostic.uri)
      continue

      gauge.dataStore.scenarioStore.put("expectedDiagnosticsValidated",true)
      console.log("validating diagnostic response")
              
      assert.equal(diagnostic.message, expectedDiagnostic.message, 
      JSON.stringify(diagnostic.message) + " not equal to " 
      + JSON.stringify(expectedDiagnostic.message));        
        
    if(expectedDiagnostic.severity)
    {
      assert.equal(diagnostic.severity, expectedDiagnostic.severity, 
        JSON.stringify(diagnostic.severity) + " not equal to " 
        + JSON.stringify(expectedDiagnostic.severity));        
    }
  }

  if(!gauge.dataStore.scenarioStore.get('expectedDiagnostics'))
  {
    throw new Error('reponse did not contain diagnostics for '+expectedDiagnostic.uri)    
  }
}

step("open file <filePath> and handle diagnostics for content <contents>", async function (filePath, contents, done) {
  var content = table.tableToArray(contents).join("\n");
  await notification.openFile(
    {
      path: filePath,
      content: content,
    }, daemon.connection(), daemon.projectUri())
  daemon.handle(handleDiagnosticsResponse, done);
});

step("diagnostics should contain diagnostics for <filePath> <diagnosticsList>", async function (filePath,diagnosticsList) {
    var currentFileUri = path.join(daemon.projectUri(), filePath);
    gauge.dataStore.scenarioStore.put('currentFileUri', currentFileUri);        

    var result = await builder.buildExpectedRange(diagnosticsList,currentFileUri);
    gauge.dataStore.scenarioStore.put('expectedDiagnostics',result)
});
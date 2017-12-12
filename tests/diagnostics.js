"use strict";

const rpc = require('vscode-jsonrpc');
var daemon = require('./lsp/daemon');
var request = require('./lsp/request');
var table = require('./util/table');
var assert = require('assert');
var builder = require('./lsp/util/dataBuilder');
var path = require('path');
var notification = require('./lsp/notification');

async function verifyDiagnosticsResponse(responseMessage,expectedDiagnostics) {  
  var responseUri = builder.getResponseUri(responseMessage.uri)
  var expectedDiagnosticsValidated = false

  for (var rowIndex = 0; rowIndex < expectedDiagnostics.length; rowIndex++) {
    var expectedDiagnostic = expectedDiagnostics[rowIndex]
    var diagnostic = responseMessage.diagnostics[rowIndex];

    if(responseUri.toLowerCase()!=expectedDiagnostic.uri.toLowerCase())
      continue

    expectedDiagnosticsValidated = true
            
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

  if(!expectedDiagnosticsValidated)
  {
    throw new Error('reponse did not contain diagnostics for '+expectedDiagnostic.uri)    
  }
}

step("diagnostics should contain diagnostics for <filePath> <diagnosticsList>", async function (filePath,diagnosticsList) {
    var currentFileUri = path.join(daemon.projectPath(), filePath);
    gauge.dataStore.scenarioStore.put('currentFileUri', currentFileUri);        

    var result = builder.buildExpectedRange(diagnosticsList,currentFileUri);

    daemon.connection().onNotification(new rpc.NotificationType("textDocument/publishDiagnostics"), (res) => {
      verifyDiagnosticsResponse(res,result)
      done();
      });
  
});
"use strict";

const rpc = require('vscode-jsonrpc');
var daemon = require('./lsp/daemon');
var request = require('./lsp/request');
var table = require('./util/table');
var file = require('./util/fileExtension');
var assert = require('assert');
var builder = require('./lsp/util/dataBuilder');
var path = require('path');
var notification = require('./lsp/notification');

async function verifyDiagnosticsResponse(responseMessage) {  
  var expectedDiagnostics =gauge.dataStore.scenarioStore.get('expectedDiagnostics');
  var responseUri = builder.getResponseUri(responseMessage.params.uri)

  for (var rowIndex = 0; rowIndex < expectedDiagnostics.length; rowIndex++) {
    var expectedDiagnostic = expectedDiagnostics[rowIndex]

    if(file.getPath(responseUri)!=file.getPath(expectedDiagnostic.uri))
      continue  

    var allDiagnosticsForFile = responseMessage.params.diagnostics.filter(function(elem, i, array) {
      return elem.message === expectedDiagnostic.message;
    });              

    if(allDiagnosticsForFile.length==0)
    {
      console.log(expectedDiagnostic.message+" not found in "+JSON.stringify(responseMessage.params))
      assert.fail(expectedDiagnostic.message+" not found in "+JSON.stringify(responseMessage.params))            
    }
        
    console.log("validated "+expectedDiagnostic.message)
    var diagnostic = allDiagnosticsForFile[0]
    if(expectedDiagnostic.severity)
    {
      assert.equal(diagnostic.severity, expectedDiagnostic.severity, 
        JSON.stringify(diagnostic.severity) + " not equal to " 
        + JSON.stringify(expectedDiagnostic.severity));        
    }
  }
}

step("diagnostics should contain diagnostics for <filePath> <diagnosticsList>", async function (filePath,diagnosticsList,done) {
    var result = await builder.buildExpectedRange(diagnosticsList);
    gauge.dataStore.scenarioStore.put('expectedDiagnostics',result)
    await daemon.handle(verifyDiagnosticsResponse, done);        
});
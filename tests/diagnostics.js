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
      return elem.message == expectedDiagnostic.message;
    });              

    if(allDiagnosticsForFile.length==0)
      throw new Error(expectedDiagnostic.message+" not found in "+JSON.stringify(responseMessage.params))
        
    console.log("here")
    var diagnostic = allDiagnosticsForFile[0]
    if(expectedDiagnostic.severity)
    {
      assert.equal(diagnostic.severity, expectedDiagnostic.severity, 
        JSON.stringify(diagnostic.severity) + " not equal to " 
        + JSON.stringify(expectedDiagnostic.severity));        
    }
  }
}

step("open file <filePath> and handle diagnostics for content <contents>", async function (filePath, contents, done) {
  var content = table.tableToArray(contents).content;
  await notification.openFile(
    {
      path: filePath,
      content: content,
    }, daemon.connection(), daemon.projectPath())
  daemon.handle(verifyDiagnosticsResponse, done);
});

step("diagnostics should contain diagnostics for <filePath> <diagnosticsList>", async function (filePath,diagnosticsList) {
    var currentFileUri = file.getPath(daemon.projectPath(), filePath);
    gauge.dataStore.scenarioStore.put('currentFileUri', currentFileUri);        

    var result = await builder.buildExpectedRange(diagnosticsList,currentFileUri);
    gauge.dataStore.scenarioStore.put('expectedDiagnostics',result)
});
"use strict";

var assert = require('assert');
const rpc = require('vscode-jsonrpc');

var daemon = require('./lsp/daemon');
var notification = require('./lsp/notifications/notification');
var request = require('./lsp/requests/request');
var table = require('./util/table');
var assertion = require('./util/assertion');
var stringExtension = require('./util/stringExtension');
var builder = require('./lsp/util/dataBuilder');
var path = require('path');


async function handleDiagnosticsResponse(responseMessage) {  
  
  var expectedDiagnostics =gauge.dataStore.scenarioStore.get('expectedDiagnostics');

  var responseUri = responseMessage.params.uri.replace("file:///","")
  responseUri = stringExtension.replaceAll(responseUri,"/","\\");
  
  for (var rowIndex = 0; rowIndex < expectedDiagnostics.length; rowIndex++) {
    var expectedDiagnostic = expectedDiagnostics[rowIndex]
    var diagnostic = responseMessage.params.diagnostics[rowIndex];

    if(responseUri!=expectedDiagnostic.uri)
      continue
    
    await assertion.assertDeepEqualWithMessage(diagnostic.range, expectedDiagnostic.range)
    
    if(expectedDiagnostic.severity)
      await assertion.assertEqualWithMessage(diagnostic.severity,expectedDiagnostic.severity)

    if(expectedDiagnostic.message)
      await assertion.assertEqualWithMessage(diagnostic.message,expectedDiagnostic.message)
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

step("diagnostics should contain error for <filePath> <errorList>", async function (filePath,errorList) {
    var currentFileUri = path.join(daemon.projectUri(), filePath);
    gauge.dataStore.scenarioStore.put('currentFileUri', currentFileUri);        
    
    var result = await builder.buildExpectedRange(errorList,currentFileUri);
    gauge.dataStore.scenarioStore.put('expectedDiagnostics',result)
});
"use strict";

var assert = require('assert');
const rpc = require('vscode-jsonrpc');

var daemon = require('./lsp/daemon');
var notification = require('./lsp/notifications/notification');
var request = require('./lsp/requests/request');
var table = require('./util/table');
var builder = require('./lsp/util/dataBuilder');
var path = require('path');


async function handleDiagnosticsResponse(responseMessage) {  
  
  var expectedErrors =gauge.dataStore.scenarioStore.get('expectedErrors');

  if(!String.prototype.replaceAll){
    String.prototype.replaceAll = function(search, replacement) {
      var target = this;
      return target.replace(new RegExp(search, 'g'), replacement);
    }  
  }

  var responseUri = responseMessage.params.uri.replace("file:///","").replaceAll("/","\\");
  
  for (var rowIndex = 0; rowIndex < expectedErrors.length; rowIndex++) {
    var expectedError = expectedErrors[rowIndex]

    if(responseUri==expectedError.uri)
    {  
      assert.deepEqual(responseMessage.params.diagnostics[rowIndex].range, expectedError.range, 
        JSON.stringify(responseMessage.params.diagnostics[rowIndex].range) + " not equal to " 
        + JSON.stringify(expectedError.range));
      
      if(expectedError.severity)
      {
        assert.equal(responseMessage.params.diagnostics[rowIndex].severity, expectedError.severity, 
          JSON.stringify(responseMessage.params.diagnostics[rowIndex].severity) + " not equal to " 
          + JSON.stringify(expectedError.severity));        
      }

      if(expectedError.message)
      {
        assert.equal(responseMessage.params.diagnostics[rowIndex].message, expectedError.message, 
          JSON.stringify(responseMessage.params.diagnostics[rowIndex].message) + " not equal to " 
          + JSON.stringify(expectedError.message));        
      }
    }
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
    gauge.dataStore.scenarioStore.put('expectedErrors',result)
});

step("diagnostics should contain circular reference error at line <line> start index <startIndex> end index <endIndex> severity <severity> in concept <concept>",async function(line,startIndex,endIndex,severity,filePath){
  //  "Circular reference found in concept. "Concept1" => <projectDir>specsconceptscircularConceptReference.cpt:2"
  var currentFilePath = gauge.dataStore.scenarioStore.get('currentFilePath');
  
  var message = ("Circular reference found in concept. <filename> => %s%s:<line>",concept,daemon.projectUri(),currentFilePath,line)
  var result = buildExpectedResult(line,
    startIndex,endIndex,severity,message);

    expectedErrors.push(expectedError)
  
})
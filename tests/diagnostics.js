"use strict";

var assert = require('assert');
const rpc = require('vscode-jsonrpc');

var daemon = require('./lsp/daemon');
var notification = require('./lsp/notifications/notification');
var request = require('./lsp/requests/request');
var timer = require('./util/timer');
var table = require('./util/table');

function handleDiagnosticsResponse(responseMessage){
  var expectedErrors = gauge.dataStore.scenarioStore.get("expectedErrors");  
  var line_index = expectedErrors.headers.cells.indexOf('line')
  var range_start_index = expectedErrors.headers.cells.indexOf('range_start')
  var range_end_index = expectedErrors.headers.cells.indexOf('range_end')
  var severity_index = expectedErrors.headers.cells.indexOf('severity')
  var message_index = expectedErrors.headers.cells.indexOf('message')  

  for(var rowIndex=0;rowIndex<expectedErrors.rows.length;rowIndex++){
    var expectedError = expectedErrors.rows[rowIndex].cells
    
    var result = {"range":{"start":{"line": parseInt(expectedError[line_index]),
    "character":parseInt(expectedError[range_start_index])},
    "end":{"line":parseInt(expectedError[line_index]),"character":parseInt(expectedError[range_end_index])}},
    "severity":parseInt(expectedError[severity_index]),"message":expectedError[message_index]};

    assert.deepEqual(responseMessage.params.diagnostics[rowIndex],result,JSON.stringify(responseMessage.params.diagnostics[rowIndex])+" not equal to "+JSON.stringify(result));
  }
}

step("open file <filePath> and handle diagnostics for content <contents>",async function(filePath,contents){  
    var content = table.tableToArray(contents).join("\n")

    await notification.openFile(
      {
        path:filePath,
        content:content,        
      },gauge.dataStore.scenarioStore,handleDiagnosticsResponse)

    timer.sleep(2000);
  });
  
step("diagnostics should contain error <errorList>",async function(errorList){
  gauge.dataStore.scenarioStore.put("expectedErrors",errorList)
});
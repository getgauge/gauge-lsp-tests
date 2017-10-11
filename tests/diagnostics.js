"use strict";

var assert = require('assert');
const rpc = require('vscode-jsonrpc');

var daemon = require('./lsp/daemon');
var notification = require('./lsp/notifications/notification');
var request = require('./lsp/requests/request');
var table = require('./util/table');
var store = gauge.dataStore.scenarioStore;
var expectedErrors = {}

async function handleDiagnosticsResponse(responseMessage) {
  var lineIndex = expectedErrors.headers.cells.indexOf('line')
  var rangeStartIndex = expectedErrors.headers.cells.indexOf('range_start')
  var rangeEndIndex = expectedErrors.headers.cells.indexOf('range_end')
  var severityIndex = expectedErrors.headers.cells.indexOf('severity')
  var messageIndex = expectedErrors.headers.cells.indexOf('message')

  for (var rowIndex = 0; rowIndex < expectedErrors.rows.length; rowIndex++) {
    var expectedError = expectedErrors.rows[rowIndex].cells

    var result = {
      "range": {
        "start": {
          "line": parseInt(expectedError[lineIndex]),
          "character": parseInt(expectedError[rangeStartIndex])
        },
        "end": { "line": parseInt(expectedError[lineIndex]), "character": parseInt(expectedError[rangeEndIndex]) }
      },
      "severity": parseInt(expectedError[severityIndex]), "message": expectedError[messageIndex]
    };

    assert.deepEqual(responseMessage.params.diagnostics[rowIndex], result, JSON.stringify(responseMessage.params.diagnostics[rowIndex]) + " not equal to " + JSON.stringify(result));
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

step("diagnostics should contain error <errorList>", async function (errorList) {
  expectedErrors = errorList
});
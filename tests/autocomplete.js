"use strict";

var assert = require('assert');
const rpc = require('vscode-jsonrpc');

var daemon = require('./lsp/daemon');
var notification = require('./lsp/notifications/notification');
var request = require('./lsp/requests/request');

var table = require('./util/table');
var expectedSteps = [];
var responseType = {
  Function: 3,
  Variable: 4
}

var currentFilePath;

step("open file <filePath> <contents>", async function (filePath, contents) {
  var content = table.tableToArray(contents).join("\n")
  currentFilePath = filePath;
  await notification.openFile(
    {
      path: filePath,
      content: content
    }, daemon.connection(), daemon.projectUri())
});

step("autocomplete at line <lineNumber> character <characterNumber> should give parameters <expectedResult>", async function (lineNumber, characterNumber, expectedResult, done) {
  expectedParameters = table.tableToArray(expectedResult)
  var position = {
    lineNumber: lineNumber,
    characterNumber: characterNumber
  }
  await request.autocomplete(position, daemon.projectUri() + currentFilePath, daemon.connection());

  daemon.handle(handleParameterResponse, done);
});

step("autocomplete at line <lineNumber> character <characterNumber> should give steps <expectedResult>", async function (lineNumber, characterNumber, expectedResult, done) {
  expectedSteps = table.tableToArray(expectedResult)

  var position = {
    lineNumber: lineNumber,
    characterNumber: characterNumber
  }
  await request.autocomplete(position, daemon.projectUri() + currentFilePath, daemon.connection());

  daemon.handle(handleStepsResponse, done);
});

step("start gauge daemon for project <relativePath>", async function (relativePath) {
  await daemon.startGaugeDaemon(relativePath);
});

async function handleStepsResponse(responseMessage) {
  if (responseMessage.result) {
    for (var index = 0; index < responseMessage.result.items.length; index++) {
      var item = responseMessage.result.items[index]

      if (item.kind != responseType.Function)
        continue
      assert.equal(item.kind, responseType.Function);
      assert.ok(expectedSteps.indexOf(item.label) > -1, JSON.stringify(item))
    }
  }
}

async function handleParameterResponse(responseMessage) {
  if (responseMessage.result) {
    for (var index = 0; index < responseMessage.result.items.length; index++) {
      var item = responseMessage.result.items[index]
      if (item.kind != responseType.Variable)
        continue
      assert.ok(expectedParameters.indexOf(item.label) > -1, "item label not found " + item.label)
    }
  }
}

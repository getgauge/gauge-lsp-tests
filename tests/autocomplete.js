'use strict';
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
};

step('autocomplete at line <lineNumber> character <characterNumber> should give parameters <expectedResult>', async function (lineNumber, characterNumber, expectedResult, done) {
    expectedParameters = table.tableToArray(expectedResult);
    var position = {
        lineNumber: lineNumber,
        characterNumber: characterNumber
    };

    var currentFilePath = gauge.dataStore.scenarioStore.get('currentFilePath');
    await request.autocomplete(position, daemon.projectUri() + currentFilePath, daemon.connection());
    daemon.handle(handleParameterResponse, done);
});
step('autocomplete at line <lineNumber> character <characterNumber> should give steps <expectedResult>', async function (lineNumber, characterNumber, expectedResult, done) {
    expectedSteps = table.tableToArray(expectedResult);
    var position = {
        lineNumber: lineNumber,
        characterNumber: characterNumber
    };
    var currentFilePath = gauge.dataStore.scenarioStore.get('currentFilePath');
    await request.autocomplete(position, daemon.projectUri() + currentFilePath, daemon.connection());
    daemon.handle(handleStepsResponse, done);
});

async function handleStepsResponse(responseMessage) {
    if (!responseMessage.result)
    return
    
    for (var index = 0; index < responseMessage.result.items.length; index++) {
        var item = responseMessage.result.items[index];
        if (item.kind != responseType.Function)
            continue;
        assert.equal(item.kind, responseType.Function);
        assert.ok(expectedSteps.indexOf(item.label) > -1, ("expected steps %s should contain %s",expectedSteps, JSON.stringify(item)));
    }
}

async function handleParameterResponse(responseMessage) {
    if (!responseMessage.result)
    return

    for (var index = 0; index < responseMessage.result.items.length; index++) {
        var item = responseMessage.result.items[index];
        if (item.kind != responseType.Variable)
            continue;
        assert.ok(expectedParameters.indexOf(item.label) > -1, 'item label not found ' + item.label);
    }
}
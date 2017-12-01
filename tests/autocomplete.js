'use strict';
var assert = require('assert');
const rpc = require('vscode-jsonrpc');
var daemon = require('./lsp/daemon');
var notification = require('./lsp/notifications/notification');
var request = require('./lsp/requests/request');
var table = require('./util/table');
var path = require('path');

var expectedSteps = [];
var responseType = {
    Function: 3,
    Variable: 4
};
  
step('autocomplete at line <lineNumber> character <characterNumber> should give <element> <expectedResult>', 
async function (lineNumber, characterNumber,element, expectedResult, done) {
    var position = {
        lineNumber: lineNumber,
        characterNumber: characterNumber
    };
    var currentFilePath = gauge.dataStore.scenarioStore.get('currentFilePath');
    await request.autocomplete(position, daemon.projectUri() + currentFilePath, daemon.connection());
    if("steps"==element)
    {
        expectedSteps = table.tableToArray(expectedResult);
        daemon.handle(handleStepsResponse, done);    
        return
    }
    if("parameters"==element)
    {
        expectedParameters = table.tableToArray(expectedResult);    
        daemon.handle(handleParameterResponse, done);
        return
    }
    throw new Error("unknown type "+element)
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

    console.log("step response validating "+ responseMessage.result.items.length+"items")    
}

async function handleParameterResponse(responseMessage) {
    if (!responseMessage.result)
    return
     
    assert.equal(expectedParameters.length,responseMessage.result.items.length,"number of parameters expected"+expectedParameters.length+" and actual parameters "+responseMessage.result.items.length+" should be the same")
    
    for (var index = 0; index < responseMessage.result.items.length; index++) {
        var item = responseMessage.result.items[index];
        
        if (item.kind != responseType.Variable)
            continue;
        assert.ok(expectedParameters.indexOf(item.label) > -1, 'item label not found ' + item.label);
    }    
}
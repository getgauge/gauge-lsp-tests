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
    Parameter:6
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
    if(("parameters"==element)||("tags"==element))
    {
        expectedElements = table.tableToArray(expectedResult);    
        daemon.handle(handleAutocompleteResponse, done);
        return
    }

    throw new Error("unknown type "+element)
});

async function handleStepsResponse(responseMessage) {
    await processAutocompleteResponse(responseMessage, expectedSteps, responseType.Function)
}

async function handleAutocompleteResponse(responseMessage) {
    await processAutocompleteResponse(responseMessage, expectedElements, responseType.Parameter)
}

async function processAutocompleteResponse(responseMessage,expected, kind){
    if (!responseMessage.result)
    return
         
    for (var index = 0; index < responseMessage.result.items.length; index++) {
        var item = responseMessage.result.items[index];
        
        if (item.kind != kind)
            continue;
            
        assert.ok(expected.indexOf(item.label) > -1, 'item label not found ' + item.label);
    }
    
    assert.equal(expected.length,responseMessage.result.items.length,"expected "
    +expected.length+" actual "+responseMessage.result.items.length)    
}
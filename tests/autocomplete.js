'use strict';
var assert = require('assert');
const rpc = require('vscode-jsonrpc');
var daemon = require('./lsp/daemon');
var notification = require('./lsp/notifications/notification');
var request = require('./lsp/requests/request');
var table = require('./util/table');
var path = require('path');

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
    expectedElements = table.tableToArray(expectedResult);
    expectedKind = null;
    
    if("steps"==element)
        expectedKind = responseType.Function
    if(("parameters"==element)||("tags"==element))
        expectedKind = responseType.Parameter        

    if(expectedKind)
        daemon.handle(handleAutocompleteResponse, done);    
    else
        throw new Error("unknown type "+element)
});

async function handleAutocompleteResponse(responseMessage) {
    if (!responseMessage.result)
    return
         
    for (var index = 0; index < responseMessage.result.items.length; index++) {
        var item = responseMessage.result.items[index];
        
        if (item.kind != expectedKind)
            continue;
            
        assert.ok(expectedElements.indexOf(item.label) > -1, 'item label not found ' + item.label);
    }
    
    assert.equal(expectedElements.length,responseMessage.result.items.length,"expected "
    +expectedElements.length+" actual "+responseMessage.result.items.length)    
}
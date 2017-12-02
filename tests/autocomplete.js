'use strict';
const rpc = require('vscode-jsonrpc');
var daemon = require('./lsp/daemon');
var notification = require('./lsp/notifications/notification');
var request = require('./lsp/requests/request');
var table = require('./util/table');
var path = require('path');
var assertionExtension = require('./util/assertionExtension');

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
         
    var actualNumberOfItems = responseMessage.result.items.length;

    for (var index = 0; index < actualNumberOfItems; index++) {
        var item = responseMessage.result.items[index];
        
        if (item.kind != expectedKind)
            continue;
            
        assertionExtension.assertContains(expectedElements,item.label)
    }
    
    assertionExtension.assertEqual(expectedElements.length,actualNumberOfItems)    
}
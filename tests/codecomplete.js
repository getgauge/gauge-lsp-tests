'use strict';
const rpc = require('vscode-jsonrpc');
var daemon = require('./lsp/daemon');
var notification = require('./lsp/notifications/notification');
var request = require('./lsp/requests/request');
var table = require('./util/table');
var path = require('path');
var assert = require('assert')
var expected = {}

var responseType = {
    Function: 3,
    Parameter:6
};
  
step('codecomplete at line <lineNumber> character <characterNumber> should give <element> <expectedResult>', 
async function (lineNumber, characterNumber,element, expectedResult) {    
    expected = buildExpectedElements(expectedResult,element)
    if(expected.kind==null)
        throw new Error("unknown type "+element)

    var currentFilePath = gauge.dataStore.scenarioStore.get('currentFilePath');
    
    var position = {
        lineNumber: lineNumber,
        characterNumber: characterNumber
    };

    var responseMessage = await request.codecomplete(position, path.join(daemon.projectPathEncoded() , currentFilePath), daemon.connection());
    verifyAutocompleteResponse(responseMessage)
});

function buildExpectedElements(expectedResult,element){
    elements = table.tableToArray(expectedResult);
    kind = null;
    
    if("steps"==element)
        kind = responseType.Function
    if(("parameters"==element)||("tags"==element))
        kind = responseType.Parameter
    return {elements:elements,kind:kind}
}

function verifyAutocompleteResponse(responseMessage) {
    if (responseMessage.method=="textDocument/publishDiagnostics")
        return        
         
    var actualNumberOfItems = responseMessage.items.length;

    for (var index = 0; index < actualNumberOfItems; index++) {
        var item = responseMessage.items[index];
        
        if (item.kind != expected.Kind)
            continue;
            
        assert.ok(expected.elements.indexOf(item.label) > -1, 'element not found ' + item.label);    
    }
    
    assert.equal(actualNumberOfItems, expected.elements.length, 
    JSON.stringify(actualNumberOfItems) + " not equal to " 
    + JSON.stringify(expected.elements.length));            
}
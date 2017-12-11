"use strict";

var assert = require('assert');
const rpc = require('vscode-jsonrpc');
var path = require('path');
var daemon = require('./lsp/daemon');
var notification = require('./lsp/notifications/notification');
var request = require('./lsp/requests/request');
var table = require('./util/table');
var builder = require('./lsp/util/dataBuilder');
step('goto definition of <element> at <lineNumber> and <characterNumber> should give details <details>',async function(element,lineNumber,characterNumber,details){
    var response = await request.gotoDefinition(
        {lineNumber:parseInt(lineNumber),characterNumber:parseInt(characterNumber)},
        path.join(daemon.projectUri(),gauge.dataStore.scenarioStore.get('currentFilePath')), 
        daemon.connection());  

    handleDefinitionResponse(response,details)
});

function handleDefinitionResponse(resp,definitionDetails) {
    if(resp.message){
        var messageIndex = definitionDetails.headers.cells.indexOf('message')        
        assert.equal(resp.message,definitionDetails[0][messageIndex])        
    }
    if(resp.result){
        var responseMessage = resp.result
        
        var lineIndex = definitionDetails.headers.cells.indexOf('line')
        var rangeStartIndex = definitionDetails.headers.cells.indexOf('range_start')
        var rangeEndIndex = definitionDetails.headers.cells.indexOf('range_end')
        var uriIndex = definitionDetails.headers.cells.indexOf('uri')
        var definitionDetail = definitionDetails.rows[0].cells
    
        var result = {
        "range": {
            "start": {
            "line": parseInt(definitionDetail[lineIndex]),
            "character": parseInt(definitionDetail[rangeStartIndex])
            },
            "end": { "line": parseInt(definitionDetail[lineIndex]), "character": parseInt(definitionDetail[rangeEndIndex]) }
        },
        "uri": path.join(daemon.projectUri() , definitionDetail[uriIndex])
        };

        var responseUri = builder.getResponseUri(responseMessage.uri)
        
        assert.equal(responseUri,result.uri,("response Message uri %s should be equal to %s",responseUri,result.uri))        
        assert.deepEqual(responseMessage.range, result.range, JSON.stringify(responseMessage.range) + " not equal to " + JSON.stringify(result.range));      
    }
}
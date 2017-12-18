"use strict";

var assert = require('assert');
var path = require('path');
var daemon = require('./lsp/daemon');
var request = require('./lsp/request');
var table = require('./util/table');
var builder = require('./lsp/util/dataBuilder');
step('goto definition of <element> in <file> at <lineNumber> and <characterNumber> should give details <details>',async function(element,file,lineNumber,characterNumber,details){
    try
    {
        var response = await request.gotoDefinition(
            {
                lineNumber:parseInt(lineNumber),characterNumber:parseInt(characterNumber)
            },
            path.join(daemon.projectPath(),file), 
            daemon.connection());
    
        verifyDefinitionResponse(response,details)     
    }
    catch(err)
    {
        verifyRejection(err,details)
    }
});

function verifyRejection(err,details){
    var errorIndex = details.headers.cells.indexOf('error')
    if(errorIndex>=0)
        assert.equal(err.message,details.rows[0].cells[errorIndex])        
    else
        throw new Error('error not expected '+err)
}

function verifyDefinitionResponse(resp,definitionDetails) {
    if(resp==null)
        throw new Error("response message should not be null ")
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
        "uri": path.join(daemon.projectPath() , definitionDetail[uriIndex])
        };

        var responseUri = builder.getResponseUri(responseMessage.uri)
        
        assert.equal(responseUri,result.uri,("response Message uri %s should be equal to %s",responseUri,result.uri))        
        assert.deepEqual(responseMessage.range, result.range, JSON.stringify(responseMessage.range) + " not equal to " + JSON.stringify(result.range));      
    }
}
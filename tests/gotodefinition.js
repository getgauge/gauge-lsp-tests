"use strict";

var assert = require('assert');
var languageclient = require('./lsp/languageclient');
var builder = require('./lsp/util/dataBuilder');
step('goto definition of <element> in <file> at <lineNumber> and <characterNumber> should give details <details>',async function(element,file,lineNumber,characterNumber,details){
    try
    {
        var response = await languageclient.gotoDefinition(
        {
            lineNumber:parseInt(lineNumber),characterNumber:parseInt(characterNumber)
        },
        file);
    
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
    else
    {
        gauge.message("verify definition")
        var responseMessage = resp    
        var lineIndex = definitionDetails.headers.cells.indexOf('line')
        var lineEndIndex = definitionDetails.headers.cells.indexOf('line_end')
        if(lineEndIndex==-1)
            lineEndIndex = lineIndex

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
            "end": { "line": parseInt(definitionDetail[lineEndIndex]), "character": parseInt(definitionDetail[rangeEndIndex]) }
        },
        "uri": languageclient.filePath(definitionDetail[uriIndex])
        };

        var responseUri = builder.getResponseUri(responseMessage.uri)
        
        assert.equal(responseUri,result.uri,("response Message uri %s should be equal to %s",responseUri,result.uri))        
        assert.deepEqual(responseMessage.range, result.range, JSON.stringify(responseMessage.range) + " not equal to " + JSON.stringify(result.range));      
    }
}
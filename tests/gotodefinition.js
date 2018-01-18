"use strict";

var assert = require('assert');
var languageclient = require('./lsp/languageclient');
var builder = require('./lsp/util/dataBuilder');
var YAML = require('yamljs');

step('goto definition of undefined <element> in <relativeFilePath> at <lineNumber> and <characterNumber> should give details <details>',async function(element,relativeFilePath,lineNumber,characterNumber,details){
    try
    {
        var response = await languageclient.gotoDefinition({
            lineNumber:parseInt(lineNumber),characterNumber:parseInt(characterNumber)},
            relativeFilePath);
        
        assert.equal(1,2,"Should get the message for the unimplemented step")
    }
    catch(err)
    {
        verifyRejection(err,details)
    }
});

step('goto definition of <element> in <relativeFilePath> at <lineNumber> and <characterNumber> should give details <details>',async function(element,relativeFilePath,lineNumber,characterNumber,details,done){
    var response;
    try
    {
        response = await languageclient.gotoDefinition({
            lineNumber:parseInt(lineNumber),characterNumber:parseInt(characterNumber)},
            relativeFilePath);            
    }
    catch(err)
    {
        throw new Error('Unable to goto definition '+err)
    }
    assert.ok(response!=null,"Response of a defined step should not be null")
    verifyDefinitionResponse(response,details,done)    
});

step('goto definition of step <element> in <relativeFilePath> at <lineNumber> and <characterNumber> should give details <data>',async function(element,relativeFilePath,lineNumber,characterNumber,data){
    var response;
    var details = YAML.load("specs/gotodefinition/"+data+"/"+process.env.language+"_impl.yaml");      

    try
    {
        response = await languageclient.gotoDefinition({
            lineNumber:parseInt(lineNumber),characterNumber:parseInt(characterNumber)},
            relativeFilePath);
    
        verifyStepDefinitionResponse(response,details)
    }
    catch(err)
    {
        throw new Error('Unable to goto definition '+err)
    }
    assert.ok(response!=null,"Response of a defined step should not be null")
    verifyStepDefinitionResponse(response,details)    
});

function verifyRejection(err,details){
    var errorIndex = details.headers.cells.indexOf('error')
    if(errorIndex>=0)
        assert.equal(err.message,details.rows[0].cells[errorIndex])        
    else
        throw new Error('error not expected '+err)
}

function verifyStepDefinitionResponse(resp,definitionDetails) {
    if(resp==null)
        return null
    if(resp.message){
        assert.equal(resp.message,definitionDetails.message)        
    }
    else
    {
        gauge.message("verify definition")
        var definitionDetail = definitionDetails[0]
        
        var responseMessage = resp        
        var result = {
        "range": {
            "start": {
            "line": parseInt(definitionDetail.line),
            "character": parseInt(definitionDetail.range_start)
            },
            "end": { "line": parseInt(definitionDetail.line_end), "character": parseInt(definitionDetail.range_end) }
        },
        "uri": languageclient.filePath(definitionDetail.uri)
        };

        var responseUri = builder.getResponseUri(responseMessage.uri)
        assert.equal(responseUri,result.uri,("response Message uri %s should be equal to %s",responseUri,result.uri))        
        assert.deepEqual(responseMessage.range, result.range, JSON.stringify(responseMessage.range) + " not equal to " + JSON.stringify(result.range));      
    }
}

function verifyDefinitionResponse(resp,definitionDetails,done) {
    if(resp==null)
        return
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

    done()
}
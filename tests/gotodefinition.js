"use strict";

var assert = require('assert');
var languageclient = require('./lsp/languageclient');
var builder = require('./lsp/util/dataBuilder');
var YAML = require('yamljs');

step('goto definition of <element> in <relativeFilePath> at <lineNumber> and <characterNumber> should give <type> for <details>',async function(element,relativeFilePath,lineNumber,characterNumber,type,definitionDetails){
    var response;
    var expectedError;

    try
    {
        response = await languageclient.gotoDefinition({
            lineNumber:parseInt(lineNumber),characterNumber:parseInt(characterNumber)},
            relativeFilePath);       
    }
    catch(err)
    {
        if(type!="error")
            throw new Error('Unable to goto definition '+err)
        expectedError =err
    }

    if(type=="error")
    {
        assert.ok(expectedError!=null,"Expected error")
        verifyRejection(expectedError,definitionDetails)
    }

    if(type!="error"){
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
    
        verifyDefinitionResponse(response,result)        
    }
});

step('goto definition of step <element> in <relativeFilePath> at <lineNumber> and <characterNumber> should give details <data>',async function(element,relativeFilePath,lineNumber,characterNumber,data){
    var response;
    var details = YAML.load("specs/gotodefinition/"+data+"/"+process.env.language+"_impl.yaml");      

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
    var definitionDetail = details[0]
    var expected = {
    "range": {
        "start": {
        "line": parseInt(definitionDetail.line),
        "character": parseInt(definitionDetail.range_start)
        },
        "end": { "line": parseInt(definitionDetail.line_end), "character": parseInt(definitionDetail.range_end) }
    },
    "uri": languageclient.filePath(definitionDetail.uri)
    };

    verifyGotoDefinitionResponse(expected,response)    
});

function verifyRejection(err,details){
    var errorIndex = details.headers.cells.indexOf('error')
    var expected = details.rows[0].cells[errorIndex]

    if(errorIndex<0)
        throw new Error('error not expected '+err)
    assert.equal(err.message,expected,"Expected "+expected+" Actual "+err.message)
}

function verifyGotoDefinitionResponse(expected,actual){
    var actualUri = builder.getResponseUri(actual.uri)
    
    assert.equal(actualUri,expected.uri,("response Message uri %s should be equal to %s",actualUri,expected.uri))            
    assert.deepEqual(actual.range, expected.range, JSON.stringify(actual.range) + " not equal to " + JSON.stringify(expected.range));    
}

function verifyDefinitionResponse(actual,expected) {
    gauge.message("verify definition")

    var responseUri = builder.getResponseUri(actual.uri)
    
    assert.equal(responseUri,expected.uri,("response Message uri %s should be equal to %s",responseUri,expected.uri))        
    assert.deepEqual(actual.range, expected.range, JSON.stringify(actual.range) + " not equal to " + JSON.stringify(expected.range));
}
"use strict";

var assert = require('assert');
var languageclient = require('./lsp/languageclient');
var builder = require('./lsp/util/dataBuilder');

step('goto definition of <element> in <relativeFilePath> at <lineNumber> and <characterNumber> should give error for <details>',async function(element,relativeFilePath,lineNumber,characterNumber,definitionDetails){
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
        expectedError =err
    }

    assert.ok(expectedError!=null,"Expected error")
    verifyRejection(expectedError,definitionDetails)
});

step('goto definition of step <element> in <relativeFilePath> at <lineNumber> and <characterNumber> should give details <data>',async function(element,relativeFilePath,lineNumber,characterNumber,data){
    var response;
    var details = builder.loadData(data)

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

    if(definitionDetail.line_end==null)
        definitionDetail.line_end = definitionDetail.line

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
    gauge.message("verified "+actual.uri)

    assert.equal(actualUri,expected.uri,("response Message uri %s should be equal to %s",actualUri,expected.uri))            
    assert.deepEqual(actual.range, expected.range, JSON.stringify(actual.range) + " not equal to " + JSON.stringify(expected.range));    
}
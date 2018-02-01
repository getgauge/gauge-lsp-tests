'use strict';
var languageclient = require('./lsp/languageclient');
var table = require('./util/table');
var assert = require('assert')

var responseType = {
    Function: 3,
    Parameter:6
};

step("codecomplete in <filePath> at line <lineNumber> character <characterNumber> should be performant", async function(filePath,lineNumber, characterNumber) {    
    var position = {
        lineNumber: lineNumber,
        characterNumber: characterNumber
    };

    var responseMessage;
    var start = Date.now()
    try{
        responseMessage = await languageclient.codecomplete(position, filePath);
    }
    catch(err){
        throw new Error("unable to verify Auto complete response "+err)
    }
    finally{
        var end = Date.now()
        console.log(end-start+" milliseconds")
        console.log(responseMessage)
    }
});
step('codecomplete in <filePath> at line <lineNumber> character <characterNumber> should give <element> <expectedResult>', 
async function (filePath,lineNumber, characterNumber,element, expectedResult) {    
    var expected = buildExpectedElements(expectedResult,element)
    if(expected.kind==null)
        throw new Error("unknown type "+element)
    
    var position = {
        lineNumber: lineNumber,
        characterNumber: characterNumber
    };

    var responseMessage;
    try{
        responseMessage = await languageclient.codecomplete(position, filePath);
    }
    catch(err){
        throw new Error("unable to verify Auto complete response "+err)
    }
    verifyAutocompleteResponse(responseMessage,expected)
})

function buildExpectedElements(expectedResult,element){
    elements = table.tableToArray(expectedResult);
    kind = null;
    
    if("steps"==element)
        kind = responseType.Function
    if(("parameters"==element)||("tags"==element))
        kind = responseType.Parameter
    return {elements:elements,kind:kind}
}

function verifyAutocompleteResponse(responseMessage,expected) {
    if (responseMessage.method=="textDocument/publishDiagnostics")
        return        
    var actualNumberOfItems = responseMessage.items.length;

    for (var index = 0; index < actualNumberOfItems; index++) {
        var item = responseMessage.items[index];

        gauge.message("verified "+item.label)
        assert.ok(expected.elements.label.indexOf(item.label) > -1, 'label not found ' + item.label);    
        if(expected.elements.detail)
            assert.ok(expected.elements.detail.indexOf(item.detail) > -1, 'detail not found ' + item.detail);            
    }
    
    assert.equal(actualNumberOfItems, expected.elements.label.length, 
    JSON.stringify(actualNumberOfItems) + " not equal to " 
    + JSON.stringify(expected.elements.label.length));  
}
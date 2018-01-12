'use strict';
var languageclient = require('./lsp/languageclient');
var table = require('./util/table');
var assert = require('assert')
var expected = {}

var responseType = {
    Function: 3,
    Parameter:6
};
  
step('codecomplete in <filePath> at line <lineNumber> character <characterNumber> should give <element> <expectedResult>', 
async function (filePath,lineNumber, characterNumber,element, expectedResult) {    
    expected = buildExpectedElements(expectedResult,element)
    if(expected.kind==null)
        throw new Error("unknown type "+element)
    
    var position = {
        lineNumber: lineNumber,
        characterNumber: characterNumber
    };

    try{
        var responseMessage = await languageclient.codecomplete(position, filePath);
        verifyAutocompleteResponse(responseMessage)
        console.log("finished")
    }
    catch(err){
        throw new Error("unable to verify Auto complete response "+err)
    }
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

function verifyAutocompleteResponse(responseMessage) {
    if (responseMessage.method=="textDocument/publishDiagnostics")
        return        
    var actualNumberOfItems = responseMessage.items.length;

    for (var index = 0; index < actualNumberOfItems; index++) {
        var item = responseMessage.items[index];

        console.log(item.label)

        assert.ok(expected.elements.label.indexOf(item.label) > -1, 'label not found ' + item.label);    
        if(expected.elements.detail)
            assert.ok(expected.elements.detail.indexOf(item.detail) > -1, 'detail not found ' + item.detail);            
    }
    
    assert.equal(actualNumberOfItems, expected.elements.label.length, 
    JSON.stringify(actualNumberOfItems) + " not equal to " 
    + JSON.stringify(expected.elements.label.length));  
}
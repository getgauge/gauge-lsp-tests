'use strict';
var languageclient = require('./lsp/languageclient');
var table = require('./util/table');
var assert = require('assert');
var responseType = {
    Function: 3,
    Parameter: 6
};
step("textDocument/completion in <filePath> for subText <subText> at line <lineNumber> character <characterNumber> should give <element> <expectedResult>", async function (filePath, argSubText, lineNumber, characterNumber, element, expectedResult) {
    var expected = buildExpectedElements(expectedResult, element, argSubText);
    if (expected.kind == null)
        throw new Error('unknown type ' + element);
    var position = {
        line: lineNumber,
        character: characterNumber
    };
    var responseMessage;
    try {
        responseMessage = await languageclient.codecomplete(position, filePath);
    } catch (err) {
        console.log(err.stack)
        gauge.message(err.stack)
        throw new Error('unable to complete action Auto complete ' + err);
    }
    verifyAutocompleteResponse(responseMessage, expected, argSubText);
});

function buildExpectedElements(expectedResult, element, subText) {
    var elements = table.tableToArray(expectedResult);
    var kind = null;
    if ('steps' == element) {
        return {
            elements: elements,
            kind: responseType.Function,
            subText: subText
        }
    }
    if ('parameters' == element || 'tags' == element)
        kind = responseType.Parameter;
    return {
            elements: elements,
            kind: kind,
        };
}

function verifyAutocompleteResponse(responseMessage, expected, subText) {
    if (responseMessage.method == 'textDocument/publishDiagnostics')
        return;

    var actualItems = responseMessage.items;
    if (subText) {
        actualItems = responseMessage.items.filter(function (elem, i, array) {
            return elem.label.startsWith(subText)
          });
    }

    var actualNumberOfItems = actualItems.length;
    for (var index = 0; index < actualNumberOfItems; index++) {
        var item = actualItems[index];
        gauge.message('verified ' + item.label);
        assert.ok(expected.elements.label.indexOf(item.label) > -1, 'label not found ' + item.label);
        if (expected.elements.detail)
            assert.ok(expected.elements.detail.indexOf(item.detail) > -1, 'detail not found ' + item.detail);
    }
    assert.equal(actualNumberOfItems, expected.elements.label.length, JSON.stringify(actualNumberOfItems) + ' not equal to ' + JSON.stringify(expected.elements.label.length));
}
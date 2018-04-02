const _languageclient = require('./lsp/languageclient')
var _customLSP = require('./lsp/customLSP');
var assert = require('assert');
var file = require('./util/fileExtension');
step('initialize test explorer and verify spec details <details>', async function (details) {
    try {
        response = await _customLSP.gaugeSpecs();
    } catch (err) {
        throw new Error('unable to verify spec details ' + err);
    }
    verifySpecificationList(JSON.parse(details), response);
});

async function verifySpecificationList(expected, actual) {
    assert.equal(expected.length,actual.length)
    for(var i=0;i<expected.length;i++){
        assert.equal(expected[i].heading,actual[i].heading)
        assert.equal(_languageclient.filePath(expected[i].executionIdentifier),actual[i].executionIdentifier)
    }
}

async function verifyScenarioList(expected, actual){
    assert.equal(expected.length,actual.length)    
    for(var i=0;i<expected.length;i++){
        assert.equal(expected[i].heading,actual[i].heading)
        assert.equal(expected[i].lineNo,actual[i].lineNo)
        assert.equal(_languageclient.filePath(expected[i].executionIdentifier),actual[i].executionIdentifier)
    }
}

step('select specification <spec> and verify scenario details <details>', async function (spec, details) {
    try {
        response = await _customLSP.gaugeScenarios(spec);
    } catch (err) {
        throw new Error('unable to verify scenario details ' + err);
    }
    verifyScenarioList(JSON.parse(details), response);
});
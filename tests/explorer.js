const _languageclient = require('./lsp/languageclient')
var _customLSP = require('./lsp/customLSP');
var assert = require('assert');
var file = require('./util/fileExtension');
step('initialize test explorer and verify spec details <details>', async function (details) {
    try {
        response = await _customLSP.gaugeSpecs();
    } catch (err) {
        console.log(err.stack)
        gauge.message(err.stack)

        throw new Error('unable to verify spec details ' + err);
    }
    verifyExplorerList(JSON.parse(details), response);
});

async function verifyExplorerList(expected, actual){
    assert.equal(expected.length,actual.length)    
    for(var i=0;i<expected.length;i++){
        assert.equal(expected[i].heading,actual[i].heading)
        if(actual[i].lineNo)
            assert.equal(expected[i].lineNo,actual[i].lineNo)
        assert.equal(_languageclient.filePath(expected[i].executionIdentifier),actual[i].executionIdentifier)
    }
}

step('select specification <spec> and verify scenario details <details>', async function (spec, details) {
    try {
        response = await _customLSP.gaugeScenarios(spec);
    } catch (err) {
        console.log(err.stack)
        gauge.message(err.stack)

        throw new Error('unable to verify scenario details ' + err);
    }
    verifyExplorerList(JSON.parse(details), response);
});
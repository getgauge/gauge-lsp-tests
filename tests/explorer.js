var languageclient = require('./lsp/languageclient');
var assert = require('assert');
var file = require('./util/fileExtension');
step('initialize test explorer and verify spec details <details>', async function (details) {
    try {
        response = await languageclient.gaugeSpecs();
    } catch (err) {
        throw new Error('unable to verify spec details ' + err);
    }
    verifySpecificationList(JSON.parse(details), response);
});
async function verifySpecificationList(expected, actual) {
    for(var i=0;i<expected.length;i++){
        assert.equal(expected[i].heading,actual[i].heading)
        assert.equal(languageclient.filePath(expected[i].executionIdentifier),actual[i].executionIdentifier)
    }
    //assert.ok(expected.executionIdentifier,file.getFullPath(actual))
}
step('select specification <spec> and verify scenario details <details>', async function (spec, details) {
});
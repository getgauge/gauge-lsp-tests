const path = require('path');
const _languageClient = require('./languageclient');
const _request = require('./rpc/request');

function getExecutionStatus(){
    return _languageClient.sendRequest('gauge/executionStatus', {});
}

function getRunnerLanguage(){
    return _languageClient.sendRequest('gauge/getRunnerLanguage', undefined);
}

function generateInExistingConcept(name,fileName,relativePath){
    var dirName = _languageClient.filePath(relativePath)
    return _languageClient.sendRequest('gauge/generateConcept', {
        "conceptName":conceptTemplate(name),
        "conceptFile": path.join(dirName, fileName),
        "dir":dirName
    })
}

function generateNewConcept(name,path){
    return _languageClient.sendRequest('gauge/generateConcept', {
        "conceptName":conceptTemplate(name),
        "conceptFile":"New File",
        "dir":_languageClient.filePath(path)
    })
}

function putStubImpl(fileName,userCode){
    return _languageClient.sendRequest("gauge/putStubImpl",{
        implementationFilePath:fileName,
        codes:[userCode]
    })
}

function getImplFiles() {
    return _languageClient.sendRequest("gauge/getImplFiles", {});
}

function gaugeSpecs() {
    return _languageClient.sendRequest('gauge/specs', {})
}

function gaugeScenarios(spec) {
    return _languageClient.sendRequest('gauge/scenarios', {
        "textDocument": {
            "uri": _languageClient.filePath(spec),
            "position": {
                "line": 1,
                "character": 1
            }
        }
    })
}

function conceptTemplate(name){
    return "# "+name+"\n* ";
}

function conceptFilePath(relativePath,conceptName) {
    var name = (conceptName==null)? "concept1.cpt": conceptName
    return path.join(_languageClient.filePath(relativePath),name)
}

module.exports = {
    generateNewConcept:generateNewConcept,
    generateInExistingConcept:generateInExistingConcept,
    conceptFilePath:conceptFilePath,
    conceptTemplate:conceptTemplate,
    getImplFiles:getImplFiles,
    putStubImpl:putStubImpl,
    gaugeSpecs:gaugeSpecs,
    gaugeScenarios: gaugeScenarios,
    getRunnerLanguage:getRunnerLanguage,
    getExecutionStatus:getExecutionStatus
}
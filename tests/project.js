var languageclient = require('./lsp/languageclient');
var fileExtension = require('./util/fileExtension');
var path = require('path');
var currentScenario;

step("pre-requisite <relativePath>", function(relativePath) {
    var customLogPath =  path.relative(relativePath,'logs');
    process.env.logs_directory = customLogPath+"/lsp-tests/"+currentScenario;

    languageclient.prerequisite(relativePath,process.env.language);
});

step('open the project <relativePath>', async function (relativePath) {
    try{
        await languageclient.openProject(relativePath);
    }
    catch(err){
        throw new Error("unable to start gauge daemon "+err)
    }
});

beforeScenario(async function(context){
   currentScenario = context.currentScenario.name
})

afterScenario(async function () {
    try{
        await languageclient.shutDown()
    }catch(err){
        throw new Error("trying to stop gauge daemon failed "+err)
    }
});
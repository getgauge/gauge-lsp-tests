var languageclient = require('./lsp/languageclient');
var _user = require('./user')
var fileExtension = require('./util/fileExtension');
var path = require('path');
var customLogPath;
var projectPath
step("create Project in temporary directory <relativePath>", async function(relativePath,done) {
    projectPath = await _user.createProjectInTemp(relativePath,done)
    process.env.logs_directory = path.relative(projectPath,'logs')+"/lsp-tests/"+customLogPath;
});

step("pre-requisite <relativePath>", async function(relativePath) {
    languageclient.prerequisite(projectPath,process.env.language);
});

step("open the project", async function () {
    try{
        await languageclient.openProject();
    }
    catch(err){
        throw new Error("unable to start gauge daemon "+err)
    }
});

beforeScenario(async function(context){
    customLogPath = context.currentSpec.name+"/"+context.currentScenario.name;
})

afterScenario(async function () {
    try{
        await languageclient.shutDown()
    }catch(err){
        throw new Error("trying to stop gauge daemon failed "+err)
    }
});
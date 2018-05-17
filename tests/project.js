var languageclient = require('./lsp/languageclient');
var tmpDirectory = require('./tempDirectory')
var _runner = require('./lsp/runner')
var fileExtension = require('./util/fileExtension');
var path = require('path');
var customLogPath;
step("pre-requisite <relativePath>", function(relativePath) {
    process.env.logs_directory = path.relative(relativePath,'logs')+"/lsp-tests/"+customLogPath;

    _runner.copyManifest(relativePath,process.env.language);
    _runner.bundleInstall(relativePath,process.env.language);
});

step("create project <relativePath> in a temporary Directory", async function(relativePath,done) {
    var dataprojectPath = await tmpDirectory.createTempDirectory(relativePath,done);
    gauge.dataStore.scenarioStore.put('dataprojectPath', dataprojectPath);
});

step("setup data required by runner", async function() {
    var dataprojectPath = gauge.dataStore.scenarioStore.get('dataprojectPath', dataprojectPath);
    
    process.env.logs_directory = path.relative(dataprojectPath,'logs')+"/lsp-tests/"+customLogPath;
    _runner.copyManifest(dataprojectPath,process.env.language);
    _runner.bundleInstall_tmpDirectory(dataprojectPath,process.env.language);
});

step('open the project in the temporary directory', async function () {
    try{
        dataprojectPath = gauge.dataStore.scenarioStore.get('dataprojectPath');
        await languageclient.openProject_fullPath(dataprojectPath);
    }
    catch(err){
        throw new Error("unable to start gauge daemon "+err)
    }
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
    customLogPath = context.currentSpec.name+"/"+context.currentScenario.name;
})

afterScenario(async function () {
    try{
        await languageclient.shutDown()
        // languageclient.killGaugeDaemon()
        // tmpDirectory.removeTempDirectory()
    }catch(err){
        throw new Error("trying to stop gauge daemon failed "+err)
    }
});
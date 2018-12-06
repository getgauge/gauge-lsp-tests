var languageclient = require('./lsp/languageclient');
const gaugeDaemon = require('./lsp/gauge');
var _user = require('./user')
var fileExtension = require('./util/fileExtension');
var path = require('path');
var customLogPath;
var projectPath

step("pre-requisite <relativePath>", function(relativePath) {
    languageclient.prerequisite(projectPath,process.env.language);
});

step("open the project", async function () {
    try{
        await languageclient.openProject();
    }
    catch(err){
        console.log(err.stack)
        gauge.message(err.stack)

        throw new Error("unable to start gauge daemon "+err)
    }
});

beforeScenario(async function(context){
    customLogPath = context.currentSpec.name+"/"+context.currentScenario.name;
})

step("close project", async function() {
    try{
        await languageclient.shutDown()
    }catch(err){
        console.log(err.stack)
        gauge.message(err.stack)

        throw new Error("trying to stop gauge daemon failed "+err)
    }
})

step("initialize using the initialize template", function() {
    var runner = (process.env.language=='javascript')?'js':process.env.language
    var resourcePath = path.join('./resources',runner)
    if(fileExtension.createDirIfNotPresent(resourcePath))
        gaugeDaemon.initializeWithTemplate(resourcePath, runner); 
});

step("copy template init from cache", function(cb) {
    var runner = (process.env.language=='javascript')?'js':process.env.language
    var resourcePath = path.join('./resources',runner)

    _user.copyDataToDir(resourcePath,projectPath,cb)
});

step("remove the env, specs and impl folders created by template", function() {
    fileExtension.remove(path.join(projectPath, "manifest.json"));
    fileExtension.rmContentsOfDir(path.join(projectPath,"specs"))
    fileExtension.rmContentsOfDir(path.join(projectPath,"env"))
    if(process.env.srcimplDirectory)
        fileExtension.rmContentsOfDir(path.join(projectPath,""),process.env.srcimplDirectory)
    else
        fileExtension.rmContentsOfDir(path.join(projectPath,process.env.implDirectory))
});

step("create temporary directory", function() {
    projectPath = _user.createTempDirectory()
    process.env.use_test_ga=true

    process.env.projectPath = projectPath;
    process.env.logs_directory = path.relative(projectPath,'logs')+"/lsp-tests/"+customLogPath;
});

step("copy project details from <data>", function(data,done) {
    _user.copyDataToDir(data,projectPath,done)
});

step("remove the temporary directory", async function() {
	fileExtension.rmContentsOfDir(process.env.projectPath)
});
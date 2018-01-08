var daemon = require('./lsp/daemon');
var file = require('./util/fileExtension')
var path = require('path')
var fs = require('fs');
var propertyReader = require('properties-reader');

step("start gauge daemon for project <relativePath> in language specified", async function(relativePath) {
    var properties = propertyReader(file.getFullPath("env/default/user.properties"));
    var property = properties._properties.language;
    file.copyFile(path.join("testdata","manifest-"+property+".json"),path.join(relativePath,"manifest.json"))

    try{
        await daemon.startGaugeDaemon(relativePath);        
    }
    catch(err){
        throw new Error("unable to start gauge daemon "+err)
    }    

});

step('start gauge daemon for project <relativePath>', async function (relativePath) {
    try{
        await daemon.startGaugeDaemon(relativePath);        
    }
    catch(err){
        throw new Error("unable to start gauge daemon "+err)
    }    
});

step("stop gauge daemon", async function() {
	try{
        await daemon.stopGaugeDaemon()
    }catch(err){
        throw new Error("trying to stop gauge daemon failed "+err)
    }
});
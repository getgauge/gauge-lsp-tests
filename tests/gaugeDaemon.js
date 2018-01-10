var daemon = require('./lsp/daemon');
var file = require('./util/fileExtension')
var path = require('path')
var fs = require('fs');

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
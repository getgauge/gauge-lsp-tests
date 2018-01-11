var languageclient = require('./lsp/languageclient');

step('start gauge daemon for project <relativePath>', async function (relativePath) {
    try{
        await languageclient.openProject(relativePath);        
    }
    catch(err){
        throw new Error("unable to start gauge daemon "+err)
    }    
});

step("stop gauge daemon", async function() {
	try{
        await languageclient.shutDown()
    }catch(err){
        throw new Error("trying to stop gauge daemon failed "+err)
    }
});
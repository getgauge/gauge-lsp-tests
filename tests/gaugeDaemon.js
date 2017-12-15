var daemon = require('./lsp/daemon');

step('start gauge daemon for project <relativePath>', async function (relativePath) {
    try{
        await daemon.startGaugeDaemon(relativePath);        
    }
    catch(err){
        assert.fail("erro not expected "+err)
    }    
});
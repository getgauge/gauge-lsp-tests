var daemon = require('./lsp/daemon');

step('start gauge daemon for project <relativePath>', async function (relativePath) {
    await daemon.startGaugeDaemon(relativePath);
});

step("a new step", async function() {
	throw 'Unimplemented Step';
});
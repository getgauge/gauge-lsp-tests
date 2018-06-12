const { spawn,spawnSync } = require('child_process');

async function startLSP(projectPath) {
    var args = (process.env.use_working_directory) ? ['daemon', '--lsp', "--dir=" + projectPath, "-l", "debug"] : ['daemon', '--lsp', "-l", "debug"];
    return spawn('gauge', args, { cwd: projectPath });
}

async function runSpecs(projectPath){
    return spawnSync('gauge', ['run'], { cwd: projectPath });
}

async function initializeWithTemplate(projectPath,template){
    return spawnSync('gauge', ['init',template], { cwd: projectPath });
}

module.exports = {
    startLSP:startLSP,
    runSpecs:runSpecs,
    initializeWithTemplate:initializeWithTemplate
}
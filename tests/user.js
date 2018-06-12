var tmp = require('tmp');
var ncp = require('ncp').ncp;
var os = require('os');
var file = require('./util/fileExtension')
var tmpobj; 
var cwd = process.cwd();
var path = require('path')

async function copyDataToDir(data,projectDir,cb){
    await ncp(data, projectDir,cb); 
}

async function createProjectInTemp(data,cb){
    tmpobj = tmp.dirSync();
    await ncp(data, tmpobj.name,cb); 
    if(os.platform()=='darwin')
        return "/private"+tmpobj.name;    
    return tmpobj.name;    
}

function getProjectDirectory(){
    return "/private"+tmpobj.name;
}

function removeCallback(){
    if(tmpobj)
    {
        tmpobj.removeCallback();        
    }
}

function removeTempDirectory(){
    if(tmpobj)
        file.rmDir(tmpobj.name)
}

module.exports={
    createProjectInTemp:createProjectInTemp,
    copyDataToDir:copyDataToDir,
    getProjectDirectory:getProjectDirectory,
    removeTempDirectory:removeTempDirectory,
    removeCallBack:removeCallback
}
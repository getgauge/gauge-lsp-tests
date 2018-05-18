var tmp = require('tmp');
var ncp = require('ncp').ncp;
var os = require('os');
var file = require('./util/fileExtension')
var tmpobj; 
var cwd = process.cwd();
var path = require('path')

async function createTempDirectory(data,cb){
    if(!os.platform().startsWith("win") && process.env.createTempDirectory){
        tmpobj = tmp.dirSync();
        var response = await ncp(data, tmpobj.name,cb); 
        if(os.platform()=='darwin')
            return "/private"+tmpobj.name;    
        console.log(tmpobj.name)
        return tmpobj.name;    
    }
    try{
        return path.join(cwd,data)
    }
    finally{
        cb();
    }
}

function getTempDirectoryName(){
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
    createTempDirectory:createTempDirectory,
    getTempDirectoryName:getTempDirectoryName,
    removeTempDirectory:removeTempDirectory,
    removeCallBack:removeCallback
}
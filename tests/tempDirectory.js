var tmp = require('tmp');
var ncp = require('ncp').ncp;

var file = require('./util/fileExtension')
var tmpobj; 

async function createTempDirectory(data,cb){
    tmpobj = tmp.dirSync();
    var response = await ncp(data, tmpobj.name,cb); 
    console.log(tmpobj.name)
    return tmpobj.name;    
}

function getTempDirectoryName(){
    return tmpobj.name;
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
var tmp = require("tmp");
var ncp = require("ncp").ncp;
var os = require("os");
var file = require("./util/fileExtension");
var tmpobj; 

function copyDataToDir(data,projectDir,done){
  ncp(data, projectDir,done); 
}

function createTempDirectory(){
  tmpobj = tmp.dirSync();
  if(os.platform()=="darwin")
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
    file.rmDir(tmpobj.name);
}

module.exports={
  createTempDirectory:createTempDirectory,
  copyDataToDir:copyDataToDir,
  getProjectDirectory:getProjectDirectory,
  removeTempDirectory:removeTempDirectory,
  removeCallBack:removeCallback
};
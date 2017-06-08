
const fse = require("fs-extra");
const createStateScript = require('./createStateScript');
const is_identifier = require('../../util/isIdentifier');

const is_state_engine_script = function(state_script_path){
  return is_identifier(state_script_path,'state_script');
};

const load_state_engine_path = function(sys_folder){
  console.log('state engine folder is : ', sys_folder);
  const state_scripts = [ ];

  const promise = new Promise(function(resolve,reject){
    fse.walk(sys_folder).on("data",(file)=>{
      if (is_state_engine_script(file.path)){
        console.log('found state script');
        state_scripts.push(createStateScript(file.path, sys_folder));
      }
    }).on("end",()=>{
      console.log('done loading scripts');
      console.log('scripts: ', state_scripts);
      resolve(state_scripts);
    });
  });
  return promise;
};


module.exports = load_state_engine_path;



const fse = require("fs-extra");

const createAction = require('./axioms/createAction');
const is_identifier = require('./util/isIdentifier');

const is_action = function(state_path){
  return is_identifier(state_path,"action");
};

const load_actions_path = function(sys_folder){
  const actions = [ ];

  console.log('loading actions');
  const promise = new Promise(function(resolve,reject){
    fse.walk(sys_folder).on("data",(file)=>{
      if (is_action(file.path)){
        actions.push(createAction(file.path, sys_folder));
      }
    }).on("end",()=>{
      console.log('finished loading actions');
      resolve(actions);
    });
  });
  return promise;
};


module.exports = load_actions_path;


const fse = require("fs-extra");

const createCondition = require('./axioms/createCondition');
const is_identifier = require('./util/isIdentifier');

const is_condition = function(condition_path){
  return is_identifier(condition_path,'condition');
};

const load_conditions_path = function(sys_folder){
  const conditions = [ ];

  const promise = new Promise(function(resolve,reject){
    fse.walk(sys_folder).on("data",(file)=>{
      if (is_condition(file.path)){
        conditions.push(createCondition(file.path));
      }
    }).on("end",()=>{
      resolve(conditions);
    });
  });
  return promise;
};


module.exports = load_conditions_path;


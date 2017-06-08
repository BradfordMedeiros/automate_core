const fse = require('fs-extra');
const path = require('path');

const createState = require('./axioms/createState');
const is_identifier = require('./util/isIdentifier');

const is_state = function(state_path){
  return is_identifier(state_path,"state");
};

const load_states_path = function(sys_condition_folder){
	const states = [ ];
    
	const promise = new Promise(function(resolve,reject){
		fse.walk(sys_condition_folder).on("data",(file)=>{
			if (is_state(file.path)){
				states.push(createState(file.path, sys_condition_folder));
			}
		}).on("end",()=>{
			resolve(states);
		});
	});
	return promise;
};
module.exports = load_states_path;



var child_process = require("child_process");
var path = require("path");
var fse = require("fs-extra");
var getType = require('./util/getFileType');

var action = function (the_path){
	this.path = path.resolve(the_path);
	// returns a promise
	this.execute = value => generate_action_promise(the_path,value);
    
	this.get_name = function(){
        // we consider the name the filename but not including the extension (.action.*)
		var base_name = path.basename(this.path);
		return base_name.slice(0,base_name.lastIndexOf(".action.")); 
	};

	this.get_type = function() {
		return getType(this.path);
	};
};

action.is_action = function(action_path){
	return is_identifier(action_path,"action");
};

var load_actions_path = function(sys_condition_folder){
	var actions = [ ];
    
	var promise = new Promise(function(resolve) {
		fse.walk(sys_condition_folder).on("data",(file)=>{            
			if (action.is_action(file.path)){
				console.log("added action:  "+file.path);
				actions.push(new action(file.path));
			}
		}).on("end",()=>{
			console.log("done adding actions");
			resolve(actions);
		});
	});
	return promise;
};

function is_identifier(path_to_file,type){
	if (type !== "action" && type!== "state" && type!=="condition"){
		throw (new Error("Type: "+type+" is an invalid identifier"));
	}
	var the_file = path.basename(path_to_file);
	var state = the_file.split(".");
    
	return (
        (the_file[0] !== ".") && 
        (the_file[the_file.length-1] !== ".") && 
        state[state.length-2] === type && 
        state.length-2 >0
	);

}


// promise that executes action and resolves when complete
var generate_action_promise = function(the_path, json_value){
  const actionType = getType(the_path);
    
	var the_promise = undefined;

	if (actionType === 'mqtt'){
		var the_json_value = json_value !== undefined? JSON.stringify(json_value): "0";
		var command = "echo "+the_json_value+" > "+the_path;
		//console.log("calling ", command);
        // this should be changed eventually but should be fine for now
		child_process.exec(command);
	}else if (actionType === 'javascript'){
    const command = `node ${the_path}`;

    the_promise = new Promise(function(resolve,reject){
      child_process.exec(command,
        (err,stdout,stderr)=>	{
          let is_error = false;
          try{
            console.log('parsing json');
            var json_result = JSON.parse(stdout);
            console.log('sucessfully parsed json');
          }catch(e){
            console.log('errored parsing json');
            is_error = true;
          }

          er = err;
          is_err = is_error;

          if (err === null && !is_error){
            resolve(json_result);
          }else{
            console.log('oh no error');
            console.log(err);
            console.log(stderr);
            reject(stderr);
          }
        });
    });
	} else{
		the_promise = new Promise(function(resolve,reject){
        
			var parameter = json_value === undefined? "": JSON.stringify(json_value);
			var command = the_path + " " + parameter;

			//console.log('the path ',the_path);
			//console.log('command ', command);
			child_process.exec(
				command,
				{cwd: path.resolve(the_path, "..")},
				(err,stdout,stderr)=>{
					var is_error = false;
					try{
						var json_result = JSON.parse(stdout);
					}catch(e){
						is_error = true;
					}
				if (err === null && !is_error){
				//console.log("Finished executing action success ",the_path);
					resolve(json_result);
				}else{
				//console.log("Error executing action success ",the_path);
				//console.log("expected json got ",stdout);
					reject(stderr);
				}
			});
		});
		return the_promise;
	}
};

module.exports = load_actions_path;

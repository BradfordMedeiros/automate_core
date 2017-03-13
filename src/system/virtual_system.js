
const fs = require("fs");
const path = require('path');
const load_system = require('./component/load_system');

const handlers = [ ];

const callHandlers = () => {
  handlers.forEach(handle => handle(virtual_system));
};


let virtual_system = undefined;
const load_virtual_system =(system_folder) => {
  if (virtual_system){
    virtual_system.destroy();
  }
  const load_system_promise = load_system(system_folder);
  load_system_promise.then( sys => virtual_system = sys).catch(err => {throw (err) });
  load_system_promise.then(callHandlers);
  return load_system_promise;
};

const add_condition = (name, conditionParameters) => {
  const conditionPath = path.resolve('./mock/conditions', name).concat('.condition.json');

  const thePromise = new Promise((resolve,  reject) => {
    fs.writeFile(conditionPath, JSON.stringify(conditionParameters), () => {
      load_system('./mock').then(sys => {
        virtual_system =  sys;
        resolve();
        console.log('reloaded system');
      });
    });
  }).catch(reject);
  return thePromise;
};

const delete_condition = name => {
  const conditionToDeletePath = virtual_system.conditions.filter(condition  => condition.get_name() === name)[0].path;
  fs.unlink(conditionToDeletePath);
  const promise = new Promise((resolve, reject) => {
    load_system('./mock').then(sys =>{
      virtual_system = sys;
      resolve();
      console.log('reloaded system');
    }).catch(() => {
      reject();
      console.log('error reloading system');
    });
  });
  return promise;
};



const get_virtual_system = () => virtual_system;

const onSystemLoad = func => {
  handlers.push(func);
};

module.exports = {
  load_virtual_system,
  add_condition,
  delete_condition,
  get_virtual_system,
  onSystemLoad,
};

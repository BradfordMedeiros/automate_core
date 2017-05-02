
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

const add_state = (name, code) => {
  const statePath = path.resolve('./mock/states', name).concat('.state.js');

  const thePromise = new Promise((resolve,  reject) => {
    fs.writeFile(statePath, code, () => {
      load_system('./mock').then(sys => {
        virtual_system =  sys;
        resolve();
        console.log('reloaded system');
      }).catch(reject);
    });
  });
  return thePromise;
};

const delete_state = (name, code) => {
  console.log('delete state called: name: ', name, ' code: ', code);
  throw (new Error('not implemented delete state'));
};



const add_action = (name, code) => {
  const actionPath = path.resolve('./mock/actions', name).concat('.action.js');

  const thePromise = new Promise((resolve,  reject) => {
    fs.writeFile(actionPath, code, () => {
      load_system('./mock').then(sys => {
        virtual_system =  sys;
        resolve();
        console.log('reloaded system');
      }).catch(reject);
    });
  });
  return thePromise;
};

const delete_action = name => {
  return (new Promise((resolve, reject) => {
    console.log('deleting action: ', name);
    const actions = virtual_system
      .actions
      .filter(action => action.get_name() == name);

    if (actions.length !== 1){
      reject('Invalid action to delete ' + name);
      return;
    }


    const actionPath  = actions[0].path;
    console.log('path is ', actionPath);

    fs.unlink(actionPath, (err) => {
      if (err){
        console.log('oh no couldnt delete');
        reject('error deleting path ' + actions[0].path);
      }
      console.log('yay deleted');
      load_system('./mock').then(sys => {
        virtual_system =  sys;
        resolve();
      }).catch(reject);
    });
  }));
};

const get_virtual_system = () => virtual_system;

const createSequenceSchema = actions => {
  if (!Array.isArray(actions)){
    throw (new Error('invalid parameter type'));
  }
  actions.forEach(action => {
    if (action.name === undefined || action.value === undefined ){
      throw (new Error('cannot create sequence schema for bad input'));
    }
  });

  return JSON.stringify({
    actions,
  })
};

const add_sequence = (name, actions)  => {
  const sequencePath = path.resolve('./mock/sequences', name).concat('.sequence.js');

  const thePromise = new Promise((resolve,  reject) => {
    fs.writeFile(sequencePath, createSequenceSchema(actions), () => {
      load_system('./mock').then(sys => {
        virtual_system =  sys;
        resolve();
        console.log('reloaded system');
      }).catch(reject);
    });
  });
  return thePromise;
};

const delete_sequence = name => {
  return (new Promise((resolve, reject) => {
    const sequence = virtual_system
      .sequences
      .filter(sequence => sequence.get_name() == name);

    if (sequence.length !== 1){
      reject('Invalid sequence to delete ' + name);
      return;
    }

    const sequencePath  = sequence[0].path;

    fs.unlink(sequencePath, (err) => {
      if (err){
        reject('error deleting path ' + sequence[0].path);
      }
      load_system('./mock').then(sys => {
        virtual_system =  sys;
        resolve();
      }).catch(reject);
    });
  }));
};

const onSystemLoad = func => {
  handlers.push(func);
};

module.exports = {
  load_virtual_system,
  add_condition,
  delete_condition,
  add_state,
  delete_state,
  add_action,
  delete_action,
  add_sequence,
  delete_sequence,
  get_virtual_system,
  onSystemLoad,
};


const fs = require("fs");
const path = require('path');
const load_system = require('./component/load_system');


const handlers = [ ];

const callHandlers = () => {
  handlers.forEach(handle => handle(virtual_system));
};


let virtual_system = undefined;
const load_virtual_system =(system_folder) => {
  console.log('load virtual system--------------------');
  if (virtual_system){
    virtual_system.destroy();
  }
  const load_system_promise = load_system(system_folder);
  load_system_promise.then( sys => virtual_system = sys).catch(err => {throw (err) });
  load_system_promise.then(callHandlers);
  return load_system_promise;
};

const add_condition = (name, conditionParameters) => {
  console.log('add condition --------------------');

  const conditionPath = path.resolve('./mock/conditions', name).concat('.condition.json');

  const thePromise = new Promise((resolve,  reject) => {
    fs.writeFile(conditionPath, JSON.stringify(conditionParameters), () => {
      load_system('./mock').then(sys => {
        virtual_system =  sys;
        resolve();
      });
    });
  }).catch(reject);
  return thePromise;
};

const delete_condition = name => {
  console.log('delete condition -------------------');

  const conditionToDeletePath = virtual_system.conditions.filter(condition  => condition.get_name() === name)[0].path;
  fs.unlink(conditionToDeletePath);
  const promise = new Promise((resolve, reject) => {
    load_system('./mock').then(sys =>{
      virtual_system = sys;
      resolve();
    }).catch(() => {
      reject();
    });
  });
  return promise;
};

const add_state = (name, code) => {
  console.log('add state --------------------');

  const statePath = path.resolve('./mock/states', name).concat('.state.js');

  const thePromise = new Promise((resolve,  reject) => {
    fs.writeFile(statePath, code, err => {
      if (err){
        console.log('err')
        reject();
      }else{
        load_system('./mock').then(sys => {
          virtual_system =  sys;
          resolve();
        }).catch(reject);
      }
    });
  });
  return thePromise;
};

const delete_state = (name, code) => {
  console.log('delete state --------------------');

  return (new Promise((resolve, reject) => {
    const states = virtual_system
      .states
      .filter(state => state.get_name() == name);

    if (states.length !== 1){
      reject('Invalid state to delete ' + name);
      return;
    }

    const statePath  = states[0].path;

    fs.unlink(statePath, (err) => {
      if (err){
        reject('error deleting path ' + states[0].path);
      }
      load_system('./mock').then(sys => {
        virtual_system =  sys;
        resolve();
      }).catch(reject);
    });
  }));
};

const add_action = (name, code) => {
  console.log('add action --------------------');

  const actionPath = path.resolve('./mock/actions', name).concat('.action.js');

  const thePromise = new Promise((resolve,  reject) => {
    fs.writeFile(actionPath, code, () => {
      load_system('./mock').then(sys => {
        virtual_system =  sys;
        resolve();
      }).catch(reject);
    });
  });
  return thePromise;
};

const delete_action = name => {
  console.log('delete action --------------------');

  return (new Promise((resolve, reject) => {
    const actions = virtual_system
      .actions
      .filter(action => action.get_name() == name);

    if (actions.length !== 1){
      reject('Invalid action to delete ' + name);
      return;
    }

    const actionPath  = actions[0].path;

    fs.unlink(actionPath, (err) => {
      if (err){
        reject('error deleting path ' + actions[0].path);
      }
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

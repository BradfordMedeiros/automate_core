

const fs = require('fs');
const path = require('path');
const info = require('./communication/info.js');
const createRest = require('./communication/rest.js');
const load_system = require('./system/system.js');

const isInConditions = filepath => {
  const a = path.resolve('./mock/conditions');
  const b = path.resolve(filepath);
  return b.indexOf(a) == 0;
};


let sys = undefined;
const load = () => load_system('./mock').then(theSystem => {
  if (sys){
    sys.destroy();
  }
  sys = theSystem;
  info.publishConditionNames(sys.conditions);

  const deleteCondition = conditionToDelete => {
    const conditionToDeletePath = sys.conditions.filter(condition  => condition === conditionToDelete)[0].path;
    fs.unlink(conditionToDeletePath);
    const promise = new Promise((resolve, reject) => {
      load_system('./mock').then(theSystem =>{
        sys = theSystem;
        resolve();
        console.log('reloaded system');
      }).catch(() => {
        reject();
        console.log('error reloading system');
      });
    });
    return promise;
  };

  const addCondition = (name, conditionParameters) => {
    const conditionPath = path.resolve('./mock/conditions', name).concat('.condition.json');
    console.log('adding condition at ', conditionPath);

    const thePromise = new Promise((resolve,  reject) => {
      fs.writeFile(conditionPath, JSON.stringify(conditionParameters), () => {
        load_system('./mock').then(theSystem => {
          sys=  theSystem;
          resolve();
          console.log('reloaded system');
        });
      });
    }).catch(reject);
    return thePromise;
  };

  const getConditions = () => sys.conditions;

  createRest( getConditions, addCondition, deleteCondition);


  info.onConditionToggle((conditionName, requestedState) => {
    console.log('on condition toggle called ', conditionName, ' new state ', requestedState);
    conds = sys.conditions.filter(condition => condition.get_name() === conditionName);

    if (requestedState === 'on'){
      console.log('trying to resume');
      conds.forEach(cond => {
        console.log('resuming condition ', cond.get_name());
        if (cond.get_state() === 'paused'){
          cond.resume()
        }
      });
    }else if (requestedState === 'off'){
      console.log('trying to pause');
      conds.forEach(cond => {
        console.log('pausing condition ', cond.get_name());
        if (cond.get_state() === 'active'){
          cond.pause()
        }
      });
    } else{
      console.error('got requested state of ', requestedState, ' for condition ', conditionName);
    }

    // should just publish ones that change
    info.publishConditionNames(sys.conditions);
  });
}).catch(err => console.log('could not load system ',err));


load()
module.exports = {
  load_system: load,
};

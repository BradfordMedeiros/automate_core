
const fs = require('fs');
const path = require('path');
const info = require('./communication/info.js');
const createRest = require('./communication/http/rest.js');
const load_system = require('./system/load_system.js');

con
let sys = undefined;
const load = () => load_system('./mock').then(theSystem => {
  if (sys){
    sys.destroy();
  }
  sys = theSystem;
  info.publishConditionNames(sys.conditions);


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

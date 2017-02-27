

const info = require('./info.js');
const load_system = require('./system/system.js');

let system;
let theFolder;
const load =  (folder) => {
    if (theFolder !== undefined && theFolder !== folder){
      console.error('loading a second system.  Can only load one root system');
    }
    if (!system){
      theFolder = folder;
      system = load_system(folder);
    }
    return system;
  };


load('./mock').then(sys => {
  info.publishConditionNames(sys.conditions);
  info.onConditionToggle((conditionName, requestedState) => {
    console.log('condition: ', conditionName);
    console.log('new state: ', requestedState);

    const conds = sys.conditions.filter(condition => condition.get_name() === conditionName);
    if (requestedState === 'on'){
      conds.forEach(cond => {
        console.log('resuming condition ', cond.get_name());
        if (cond.get_state() === 'paused'){
          cond.resume()
        }
      });
    }else if (requestedState === 'off'){
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
});



module.exports = {
  load_system: load,
};
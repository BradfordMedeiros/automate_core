/*
const load_system = require('./system/system.js');

const virtual_system = function(system_folder) {
  this.system = undefined;
  this.loaded = load_system(system_folder);
  this.loaded.then(sys => {
    this.system = sys;
  });
};

virtual_system.add_condition = function(name, conditionParameters) {
  this.loaded.then(() => {
    const conditionPath = path.resolve('./mock/conditions', name).concat('.condition.json');
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
  });
};

virtual_system.remove_condition = function() {

};


const addCondition = (name, conditionParameters) => {
  console.log('adding condition at ', conditionPath);


};
*/


module.exports = {
  load_system: load,
};


/*
const load_system = require('./system/system.js');

const virtual_system = undefined;
const load_virtual_system = async (system_folder) => {
  try {
    await load_system()
  }catch (err){
    console.error('could not reload virtual system');
  }
};



virtual_system.add_condition = function(name, conditionParameters) {
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
}

virtual_system.remove_condition = function() {

};
*/

console.log('hello')


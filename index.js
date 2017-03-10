
const path = require('path');
const system_mqtt = require('./communication/mqtt_system');
const virtual_system = require('./system/virtual_system');
const create_routes = require('./communication/http/rest');

const PORT = 9000;

virtual_system.onSystemLoad(() => {
  system_mqtt.publishConditionNames(virtual_system.get_virtual_system().conditions)
});

virtual_system.load_virtual_system(path.resolve('./mock')).then(() => {
  const router = create_routes(virtual_system);
  router.listen(PORT, () => console.log("Server start on port "+ PORT));

  system_mqtt.onConditionToggle((conditionName, message) => {
    const matchingConditions = virtual_system.get_virtual_system()
      .conditions
      .filter(condition => condition.get_name() === conditionName);

    if (matchingConditions.length === 1){
      const matchingCondition = matchingConditions[0];
      if (message === 'on') {
        matchingCondition.resume();
      }else if (message === 'off'){
        matchingCondition.pause();
      }
    }
  });
}).catch(()=> console.log('oh no!'));


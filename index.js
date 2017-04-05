
const process = require('process');
const path = require('path');
const mqtt_mongo = require('mqtt_mongo');

const system_mqtt = require('./src/communication/mqtt_system');
const virtual_system = require('./src/system/virtual_system');
const create_routes = require('./src/communication/http/rest');


const PORT = 9000;

const MQTT_MONGO_CONFIG = {
  MONGO_URL : 'mongodb://localhost:27017/myproject',
  MQTT_URL : 'http://127.0.0.1:1883'
};


virtual_system.onSystemLoad(() => {
  system_mqtt.publishConditionNames(virtual_system.get_virtual_system().conditions)
});

virtual_system.load_virtual_system(path.resolve('./mock')).then(() => {
  console.log('virtual system init');

  mqtt_mongo.logMqttToMongo(MQTT_MONGO_CONFIG).then(({ mongoDb, client }) => {
    console.log('logging mqtt to mongo');
    const router = create_routes(virtual_system, mongoDb);
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
  }).catch(err => { throw (new Error(err)); });
}).catch(err => {
  console.log(err);
  process.exit(1);  // might not be great for prod but definitely good for dev
});


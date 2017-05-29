
const process = require('process');
const path = require('path');
const mqtt_mongo = require('mqtt_mongo');
const fs_mount_mqtt = require('fs_mount_mqtt');

const startMqttBroker = require('./src/environment/startMqttBroker');
const startMongo = require('./src/environment/startMongo');
const startSSHServer = require('./src/environment/startSSHServer');

const system_mqtt = require('./src/communication/mqtt_system');
const virtual_system = require('./src/system/virtual_system');
const create_routes = require('./src/communication/http/rest');


const PORT = 9000;
const MONGO_PORT = 6302;

const MQTT_MONGO_CONFIG = {
  MONGO_URL : `mongodb://localhost:${MONGO_PORT}/myproject`,
  MQTT_URL : 'http://127.0.0.1:1883'
};

const FS_MOUNT_CONFIG = {
  MQTT_URL : 'http://127.0.0.1:1883',
  SYNC_FOLDER_PATH: './mock',
};

const startMqttBrokerPromise = startMqttBroker();
startMqttBrokerPromise.then(() => {
  console.log('MQTT Broker Started');
}).catch(() => {
  console.error('Error: Could not start MQTT Started');
});

const startMongoPromise = startMongo(MONGO_PORT, './data', 2000);
startMongoPromise.then(() => {
  console.log('Mongod Started');
}).catch(err => {
  console.error('Error: Could not start Mongod Started');
  console.error(err);
});

startSSHServer().then(() => console.log('wetty started')).catch(() => console.log('wetty no start'));

Promise.all([startMongoPromise,  startMongoPromise]).then(() => {
  console.log('Environment Started');
  fs_mount_mqtt.syncMqttToFileSystem(FS_MOUNT_CONFIG);

  virtual_system.onSystemLoad(() => {
    system_mqtt.publishConditionNames(virtual_system.get_virtual_system().conditions)
  });


  virtual_system.load_virtual_system(path.resolve('./mock')).then(() => {
    mqtt_mongo.logMqttToMongo(MQTT_MONGO_CONFIG).then(({mongoDb, client}) => {
      console.log('MongoDb client connected');

      const router = create_routes(virtual_system, mongoDb);
      router.listen(PORT, () => console.log("Server start on port " + PORT));

      system_mqtt.onConditionToggle((conditionName, message) => {
        const matchingConditions = virtual_system.get_virtual_system()
          .conditions
          .filter(condition => condition.get_name() === conditionName);

        if (matchingConditions.length === 1) {
          const matchingCondition = matchingConditions[0];
          if (message === 'on') {
            matchingCondition.resume();
          } else if (message === 'off') {
            matchingCondition.pause();
          }
        }
      });
    }).catch(err => {
      console.log('Could not connect Mongo or MQTT client');
      //process.exit(1);
    });
  }).catch(err => {
    console.log('Could not load virtual system');
    process.exit(1);  // might not be great for prod but definitely good for dev
  });

}).catch((err) => {
  console.error('oh no');
  process.exit(1);
});


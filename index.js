
const automate_system = require('automate_system');
const create_routes = require('./src/communication/http/rest');
const sendEmail = require('./src/util/email/sendEmail');
const getDatabaseManager = require ('./src/databaseManager');

const PORT = 9000;

const databaseManager = getDatabaseManager(automate_system.migrateDatabase);

const getInitialDatabase = new Promise((resolve, reject) => {
  databaseManager.getActiveDatabase().then(databaseName => {
    console.log('database name is: ', databaseName);
    resolve(databaseName);
  }).catch(() => {
    const defaultDatabaseName = 'automate.db';
    databaseManager.createDatabase(defaultDatabaseName).then(() => {
      databaseManager.setActiveDatabase(defaultDatabaseName).then(() => {
        resolve(defaultDatabaseName);
      }).catch(reject);
    }).catch(reject);
  });
});

getInitialDatabase.then(databaseName => {
  const dbPath = databaseManager.getDatabasePath(databaseName);
  automate_system.init({
    resourceFile: dbPath,
    mqtt: {
      // need to add: mqttIp
      useInternalBroker: true,
      mqttPort: 1883,
      httpPort: 4000,
    },
    httpBridge: {
      enabled: true,
      port: 4001,
    },
    onEvent: ({ eventName, message }) => {
      sendEmail('bradmedeiros0@gmail.com', message);
    } ,
  }).then(system => {
    sys = system;
    const router = create_routes(system, databaseManager);
    router.listen(PORT, () => console.log("Server start on port " + PORT));
  });
})



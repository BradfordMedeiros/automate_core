
const path = require('path');
const automate_system = require('automate_system');
const create_routes = require('./src/communication/http/rest');
const getEmail = require('./src/util/email/getEmail');
const getDatabaseManager = require ('./src/databaseManager');
const openInfluxAndGetWritePoint = require('./src/openInfluxAndGetWritePoint');
const tileManager = require('./src/tileManager/tileManager');
const emailManager = require('./src/emailManager');
const lockSystemManager = require('./src/lockSystemManager');
const getAccounts = require('./src/accounts/getAccounts');
const migrate = require('./src/environment/migrate');

const ACCOUNT_SECRET_FILE = path.resolve('./data/account_secret');

const email = getEmail('http://127.0.0.1:3000');

// accounts code has it's  own database.  This is a database in this project
// the other database is part of automate system dependency, which is considered different enough
// to separate the dbs
const getMigratedAccounts = () => new Promise((resolve, reject) => {
  const getDatabase = require('./src/getDatabase');
  if (migrate.isMigrated('./accounts.db')){
    const database = getDatabase('./accounts.db');
    const accounts = getAccounts(database, ACCOUNT_SECRET_FILE);
    resolve(accounts);
  }else{
    migrate.createDb('./accounts.db').then(() => {
      const database = getDatabase('./accounts.db');
      const accounts = getAccounts(database, ACCOUNT_SECRET_FILE);
      resolve(accounts);
    }).catch(err => {
      console.log('critical error could not create db');
      reject(err);
    });
  }
});

getMigratedAccounts().then(accounts => {
  const PORT = 9000;

  const writeInfluxPoint = openInfluxAndGetWritePoint();
  const databaseManager = getDatabaseManager(automate_system.migrateDatabase);

  // database manager is getting the active database to we can pass that to automate system
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

  // once we have the selected database, initialize automate
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
      onTopic: ({ topic, message }) => {
        console.log('-----------');
        console.log('topic: ', topic);
        console.log('message: ', message);
        const messageAsNumber = Number(message);

        const valueToWrite = isNaN(messageAsNumber) ? message: messageAsNumber;
        writeInfluxPoint(topic, valueToWrite).then(() => {
          console.log('wrote: ', topic, ' to influx successfully with value: ', valueToWrite);
        }).catch(err => {
          console.error('error writing to influx');
          console.error(err);
        })
      },
      onEvent: ({ eventName, message }) => {
        emailManager.getEmailInfo().then(emailInfo => {
          const emailAddress = emailInfo.emailAddress;
          const isEnabled = emailInfo.isEnabled;
          if (isEnabled){
            email.send_event_notification(emailAddress, eventName, message);
          }
        }).catch(() => {
          console.error('error getting email adddress');
        });
      },
    }).then(system => {
      sys = system;

      // start the webserver
      const router = create_routes({ system, databaseManager, tileManager, emailManager, lockSystemManager, accounts, email });
      router.listen(PORT, () => console.log("Server start on port " + PORT));
    });
  })
}).catch(err => {
  console.error('could not migrate account db: ', err);
});





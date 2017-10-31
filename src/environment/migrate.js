const fs = require('fs');
const getDatabase = require('../getDatabase');
const sequencer = require('when_do').sequencer;
const createAccountsSchema = require('../accounts/createSchema');

const migrate = db => {
  return new Promise((resolve, reject) => {
    sequencer()
      .hold(() => createAccountsSchema(db))
      .run()
      .then(resolve)
      .catch(reject);
  })
};

const isMigrated =  databaseName => {
  return fs.existsSync(databaseName);
};

const migrateDb = {
  isMigrated: isMigrated,
  createDb: databaseName => new Promise((resolve, reject) => {
    migrate(getDatabase(databaseName)).then(() => {
      getDatabase(databaseName).close();
      resolve();
    }).catch(() => {
      getDatabase(databaseName).close();
      reject();
    })
  })
};

module.exports = migrateDb;

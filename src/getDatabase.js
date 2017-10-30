
const sqlite3 = require('sqlite3');

const connectionMap = { };

const getDatabase = databaseName => ({
  open: () => {
    return new Promise((resolve, reject) => {
      if (connectionMap[databaseName]) {
        resolve(connectionMap[databaseName]);
      } else {
        connectionMap[databaseName] = new sqlite3.Database(databaseName, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(connectionMap[databaseName])
          }
        })
      }
    })
  },
  close: databaseName => {
    if (connectionMap[databaseName]){
      connectionMap[databaseName].close();
      delete connectionMap[databaseName];
    }
  },
});


module.exports = getDatabase;
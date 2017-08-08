
const fs = require('fs');
const path = require('path');

let databases = undefined;
let active_db = undefined;

const isIllegalName = databaseName => {
  return (
    (typeof(databaseName) !== typeof('')) ||
    (databaseName.indexOf('..') > -1) ||
    (databaseName.indexOf('/') > -1)
  );
};


const getDatabasePath = databaseName =>  path.resolve(`./databases/dbs/${databaseName}`);

const getDatabases = () => new Promise((resolve, reject) => {
  if (databases === undefined){
    fs.readdir('./databases/dbs', (err, dbs) => {
      if (err){
        reject(err);
      }else{
        databases = dbs;
        resolve(databases);
      }
    });
  }else{
    resolve(databases);
  }
});

const getActiveDatabase = () => new Promise((resolve, reject) => {
  if (active_db){
    resolve(active_db);
  }else{
    fs.readFile('./databases/active_db', (err, activeDatabase) => {
      if (err){
        reject(err);
      }else{
        active_db = activeDatabase.toString().trim();
        resolve(active_db);
      }
    });
  }
});

const setActiveDatabase = databaseName => {
  throw (new Error('not yet implemented'));;
};

const deleteDatabase = databaseName => (
  new Promise((resolve, reject) => {
    if (isIllegalName(databaseName)){
      reject('illegal db name');
    }else if (databaseName === active_db){
      reject('cannot delete the active database');
    }
    else{
      const dbPath = getDatabasePath(databaseName);
      getDatabases().then(dbs => {
        const dbIndex = dbs.indexOf(databaseName);
        if (dbIndex >= 0){
          fs.unlink(dbPath, err => {
            if (err){
              reject(err);
            }else{
              const leftDbs = databases.slice(0, dbIndex);
              const rightDbs = databases.slice(dbIndex + 1);
              databases = leftDbs.concat(rightDbs);
              resolve();
            }
          });
        }else{
          reject();
        }
      }).catch(reject);
    }

  })
);

const createDatabase = databaseName => (
  new Promise((resolve, reject) => {
    if (isIllegalName(databaseName)){
      reject('illegal db name')
    }else{
      getDatabases().then(databases => {
        if (databases.indexOf(databaseName) > -1){
          reject('database already exists');
        }else{
          if (databaseName.indexOf('/') > -1 || databaseName.indexOf('..') > -1){
            reject('illegal db name');
          }else{
            const dbPath = path.resolve(`./databases/dbs/${databaseName}`);
            fs.open(dbPath, "wx", function (err, fd) {
              if (err){
                reject(err);
              }else{
                fs.close(fd, function (err) {
                  if(err){
                    reject(err);
                  }else{
                    databases.push(databaseName);
                    resolve();
                  }
                });
              }
            });
          }
        }
      }).catch(reject);
    }
  })
);

const copyDatabase = (oldDatabaseName, newDatabaseName) => (
  new Promise((resolve, reject) => {
    if (isIllegalName(oldDatabaseName) ||  isIllegalName(newDatabaseName)){
      reject('illegal db name');
    }else{
      throw (new Error('not yet implementd'));
    }
  })
);



module.exports = {
  getActiveDatabase,
  setActiveDatabase,
  createDatabase,
  copyDatabase,
  deleteDatabase,
  getDatabases,
  getDatabasePath,
};
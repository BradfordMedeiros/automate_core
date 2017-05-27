const child_process = require('child_process');
const path = require('path');

const startMongod = (port, dbPath, timeout) => {
  if (typeof(port) !== typeof(1) || typeof(dbPath) !== typeof('')){
    throw (new Error('parameters to startMongod defined incorrectly'));
  }

  if (timeout !== undefined && (typeof(timeout) !== typeof(1))){
    throw (new Error('If timeout is defined, must be a number'));
  }

  const command = 'mongod --port '+ port + ' --dbpath '+ path.resolve(dbPath) + ' &';
  return (new Promise((resolve, reject) => {
    let hasTimeout = false;
    if (timeout) {
      setTimeout(() => {
        hasTimeout = true;
        reject('Mongo timeout');
      }, timeout);
    }

    child_process.exec(command, (err, result) => {
      if (err){
        if (!hasTimeout){
          reject(err);
        }
      }else{
        if (!hasTimeout){
          console.log(result)
          resolve(result);
        }
      }
    });
  }));
};

module.exports = startMongod;
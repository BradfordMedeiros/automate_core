
const child_process = require('child_process');
const path = require('path');

const startMongod = (port, dbPath) => {
  // @todo code to write start mongod here remember to pass it path to local db storage
  // --dbpath --port
  if (typeof(port) !== typeof(1) || typeof(dbPath) !== typeof('')){
    throw (new Error('parameters to startMongod defined incorrectly'));
  }

  const command = 'mongod --port '+ port + ' --dbpath '+ path.resolve(dbPath) + ' &';
  return (new Promise((resolve, reject) => {
    console.log('executing: ', command);
    child_process.exec(command, (err, result) => {
      if (err){
        reject(err);
        console.error('Could not start mongo');
      }else{
        console.log('Started mongo on port ', port);
        resolve(result);
      }
    });
  }));

};

module.exports = startMongod;
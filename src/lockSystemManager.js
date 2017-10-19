
const path = require('path');
const fs = require('fs');

let isLocked = false;
let systemName = undefined;

const lockFileName = path.resolve(__dirname,'../data/lock.json');

// checks if lock.json is there at system start
const verifySystemResources = () => {
  console.log('checking');
  const exists = fs.existsSync(lockFileName);
  if (!exists) {
    console.log('warning: lock.json does not exist');
  }
};

verifySystemResources();

const getSystemLockedData = () => new Promise((resolve, reject) => {
  fs.readFile(lockFileName, (err, data) => {
    if (err){
      reject(err);
    }else{
      try{
        const info = JSON.parse(data.toString());
        resolve(info);
      }catch(err){
        reject(err);
      }
    }
  })
});

const lockSystem = systemName => {
  if (systemName !== undefined && typeof(systemName) !== 'string'){
    throw (new Error('lockSystemManager: systenName should either be unspecified or a string'));
  }

  const jsonToWrite = {
    isLocked: true,
  };
  if (systemName){
    jsonToWrite['systemName'] = systemName;
  }

  return new Promise((resolve, reject) => {
    fs.writeFile(lockFileName,  JSON.stringify(jsonToWrite), err => {
      if (err){
        reject(err);
      }else{
        resolve();
      }
    })
  });
};

module.exports = {
  lockSystem,
  getSystemLockedData,
};
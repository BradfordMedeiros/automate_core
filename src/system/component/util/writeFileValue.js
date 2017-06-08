
const child_process = require('child_process');

const writeFileValue = (filePath, jsonValue) => {
  const jsonValueString = jsonValue !== undefined ? JSON.stringify(jsonValue): '0';
  const command = `echo ${jsonValueString} > ${filePath}`

  return new Promise((resolve, reject) =>  {
    child_process.exec(command, err=> {
        if (err){
          reject(err);
        }else {
          resolve();
        }
    });
  });
};

module.exports = writeFileValue;

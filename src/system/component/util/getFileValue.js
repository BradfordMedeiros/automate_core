const fs = require('fs');

const getFileValue = filePath => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, result) => {
      if (err) {
        reject(err);
      } else {
        const data = result.toString();
        resolve(data);
      }
    })
  })
};

module.exports = getFileValue;
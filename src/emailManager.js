
const emailInfo =  require('../data/email.json');
const fs = require('fs');
const path = require('path');

const getEmailJSON = () => new Promise((resolve, reject) => {
  fs.readFile(path.resolve(__dirname,'../data/email.json'), (err, data) => {
    if (err){
      reject(err);
    }else{
      try{
        resolve(JSON.parse(data.toString()));
      }catch(err){
        reject(err);
      }
    }
  })
});

const setEmailJSON = json => {
  if (typeof(json) !== typeof({})){
    throw (new Error('setEmailJSON object is undefined'));
  }

  return new Promise((resolve, reject) => {
    fs.writeFile(path.resolve(__dirname,'../data/email.json'),  JSON.stringify(json), err => {
      if (err){
        reject(err);
      }else{
        resolve();
      }
    })
  });
};

const setEmail = email => new Promise((resolve, reject)  => {
  if (typeof(email) !== typeof('')) {
    throw (new Error('emailManager:setEmail emailis not a string'));
  }

  getEmailJSON().then(emailInfo =>  {
    emailInfo.emailAddress = email;
    setEmailJSON(emailInfo).then(resolve).catch(reject);
  }).catch(reject);
});


const getEmail = () => new Promise((resolve, reject) => {
  getEmailJSON().then(emailInfo => {
    resolve(emailInfo.emailAddress);
  }).catch(reject);
});

const enable =  () => new Promise((resolve, reject) => {
  getEmailJSON().then(emailInfo => {
    emailInfo.isEnabled = true;
    setEmailJSON(emailInfo).then(resolve).catch(reject);
  }).catch(reject);
});

const disable =  () => new Promise((resolve, reject) => {
  getEmailJSON().then(emailInfo => {
    emailInfo.isEnabled = false;
    setEmailJSON(emailInfo).then(resolve).catch(reject);
  }).catch(reject);
});

const getIsEnabled = () => new Promise((resolve, reject) => {
  getEmailJSON().then(emailInfo => {
    resolve(emailInfo.isEnabled == true);
  }).catch(reject);
});

module.exports = {
  setEmail,
  getEmail,
  enable,
  disable,
  getIsEnabled,
  getEmailInfo : getEmailJSON,
};
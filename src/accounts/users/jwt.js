
// this file represents jwt encoding
// if does not encrypt the token, but simply produces jwt token (signature only)
// this also does not ensure anything about the user actually existing as a user account,
// and this file should not do that (do not read the database directly from this file!)

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fs = require('fs');

const secretExists = secretFileLocation => {
  if (typeof(secretFileLocation) !== typeof('')){
    throw (new Error('jwt:secretExists secretFileLocation must be defined as string'));
  }
  return fs.existsSync(secretFileLocation);
};

// https://security.stackexchange.com/questions/95972/what-are-requirements-for-hmac-secret-key
const generateSecret = () => crypto.randomBytes(32).toString();

const loadSecret = secretFileLocation => {
  if (typeof(secretFileLocation) !== typeof('')){
    throw (new Error('jwt:loadSecret secretFileLocation must be defined as string'));
  }
  return fs.readFileSync(secretFileLocation).toString();
};

const saveSecretToLocation = (secretFileLocation, secret) => {
  if (typeof(secretFileLocation) !== typeof('')){
    throw (new Error('jwt:saveSecretLocation secretFileLocation must be defined as string'));
  }
  if (typeof(secret) !== typeof('')){
    throw (new Error('jwt:saveSecretLocation secret must be defined as string'));
  }
  fs.writeFileSync(secretFileLocation, secret);
};

const generateJwtToken = (username, secret) => new Promise((resolve, reject) => {
  if (typeof(username) !== typeof('')){
    throw (new Error('jwt:generateToken username must be defined as string'));
  }
  if (typeof(secret) !== typeof('')){
    throw (new Error('jwt:generateToken secret must be defined as string'));
  }

  jwt.sign({ username }, secret, (err, token) => {
    if (err){
      reject(err);
    }else{
      resolve(token);
    }
  })
});

const generateJwtTokenWithToken = (token, secret) => new Promise((resolve, reject) => {
  if(typeof(token) !== typeof('')){
    throw (new  Error('token must be defined'));
  }
  if (typeof(secret) !== typeof('')){
    throw (new Error(' secret must be defined as string'));
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err){
      reject(err);
    }else{
      const username = decoded.username;
      jwt.sign({ username }, secret, (err, token) => {
        if (err) {
          reject(err);
        }else{
          resolve(token);
        }
      });
    }
  });
});


const getUserForJwtToken  = (token, secret) => new Promise((resolve, reject) => {
  if (typeof(token) !== typeof('')){
    throw (new Error('jwt:getUserForToken token must be defined as string'));
  }
  if (typeof(secret) !== typeof('')){
    throw (new Error('jwt:generateToken secret must be defined as string'));
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err){
      reject(err);
    }else{
      resolve(decoded.username);
    }
  });
});


const getJwt = secretFileLocation => {
  if(typeof(secretFileLocation) !== typeof('')){
    throw (new Error('jwt:getJwt secretFileLocation must be defined'));
  }

  let secret;
  if (secretExists(secretFileLocation)){
    secret = loadSecret(secretFileLocation);
  }else{
    secret = generateSecret();
    saveSecretToLocation(secretFileLocation, secret);
  }

  return ({
    generateToken: username => generateJwtToken(username, secret),
    getUserForToken: token => getUserForJwtToken(token, secret),
    generateTokenWithToken: token => generateJwtTokenWithToken(token, secret),
  });
};


module.exports = getJwt;
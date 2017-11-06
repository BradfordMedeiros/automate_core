
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

const generateJwtAuthToken = (email, secret) => new Promise((resolve, reject) => {
  if (typeof(email) !== typeof('')){
    throw (new Error('jwt:generateToken email must be defined as string'));
  }
  if (typeof(secret) !== typeof('')){
    throw (new Error('jwt:generateToken secret must be defined as string'));
  }

  jwt.sign({ email, type: 'auth' }, secret, (err, token) => {
    if (err){
      reject(err);
    }else{
      resolve(token);
    }
  })
});

const generateJwtPasswordResetToken = (email, secret) => new Promise((resolve, reject) => {
  if (typeof(email) !== typeof('')){
    throw (new Error('jwt:generateToken email must be defined as string'));
  }
  if (typeof(secret) !== typeof('')){
    throw (new Error('jwt:generateToken secret must be defined as string'));
  }

  jwt.sign({ email, type: 'reset' }, secret, (err, token) => {
    if (err){
      reject(err);
    }else{
      resolve(token);
    }
  })
});

const generateJwtAuthTokenWithAuthToken = (token, secret) => new Promise((resolve, reject) => {
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
      const email = decoded.email;
      const type = decoded.type;

      if (type !== 'auth'){
        reject('incorrect token type, but generated from automate');
      }else{
        jwt.sign({ email, type: 'auth' }, secret, (err, token) => {
          if (err) {
            reject(err);
          }else{
            resolve(token);
          }
        });
      }
    }
  });
});

const getUserForJwtAuthToken  = (token, secret) => new Promise((resolve, reject) => {
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
      const type = decoded.type;
      if (type === 'auth'){
        resolve(decoded.email);
      }else{
        reject('incorrect token type, but generated from automate');
      }
    }
  });
});

const getUserForJwtResetToken  = (token, secret) => new Promise((resolve, reject) => {
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
      const type = decoded.type;
      if (type === 'reset'){
        resolve(decoded.email);
      }else{
        reject('can only get user for a jwt token');
      }
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
    generateAuthToken: email => generateJwtAuthToken (email, secret),
    getUserForAuthToken: token => getUserForJwtAuthToken(token, secret),
    generateAuthTokenWithAuthToken: token => generateJwtAuthTokenWithAuthToken(token, secret),
    generatePasswordResetToken: email => generateJwtPasswordResetToken(email, secret),
    getUserForPasswordResetToken: token => getUserForJwtResetToken(token, secret),
  });
};


module.exports = getJwt;
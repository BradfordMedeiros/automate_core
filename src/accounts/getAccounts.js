
// file determines the interface and combines the logic for  basic user creation +  token verification

const getUsers = require('./users/getUsers');
const getJwt = require('./users/jwt');
const getNonPriviledgedAccountCreation =  require('./non_priviledged_account_creation/priviledgedAccountCreation');

const getAccounts = (db, secretFileLocation) => {
  if (db === undefined){
    throw (new Error('accounts:getAccounts db not defined'));
  }
  if (typeof(secretFileLocation) !== typeof('')){
    throw (new Error('accounts:getAccounts secretFileLocation is not defined'));
  }

  const jwt = getJwt(secretFileLocation);
  const users = getUsers(db);
  const priviledgedAccountCreation = getNonPriviledgedAccountCreation(db);

  return ({
    createUser: users.createUser,
    deleteUser: users.deleteUser,

    generateAuthToken: (email, password) => new Promise((resolve, reject) => {
      if (typeof(email) !== typeof('') || typeof(password) !== typeof('')) {
        reject('invalid parameters');
      } else {
        users.isValidCredentials(email, password).then(() => {
          jwt.generateAuthToken(email).then(resolve).catch(() => {
            reject('could  not generate token');
          });
        }).catch(() => {
          reject('invalid credentials');
        })
      }
    }),
    generateAuthTokenFromAuthToken: jwt.generateAuthTokenWithAuthToken,
    getUserForAuthToken: jwt.getUserForAuthToken,

    generatePasswordResetToken: email => new Promise((resolve, reject) =>  {
        users.getUserHash(email).then(hash => {
          jwt.generatePasswordResetToken(email, hash).then(resolve).catch(reject);
        }).catch(reject);
    }),
    getUserForPasswordResetToken:  token => new Promise((resolve, reject) =>  {
      jwt.getUserForJwtResetTokenWithoutHashConfirm(token).then(email => {
        users.getUserHash(email).then(hash => {
          jwt.getUserForPasswordResetToken(token, hash).then(resolve).catch(reject);
        }).catch(reject);
      }).catch(reject);
    }),
    getUsers: users.getUsers,
    getNonSensitiveInfoForUser: users.getAccountInformation,
    isUserAdmin: users.isUserAdmin,
    setPassword: users.setPassword,
    setProfileImage: users.setProfileImage,

    isAccountCreationAdminOnly: priviledgedAccountCreation.isAccountCreationPriviledged,
    enableAdminOnlyAccountCreation: priviledgedAccountCreation.enableNonPriviledgedAccountCreation,
    disableAdminOnlyAccountCreation: priviledgedAccountCreation.disableNonPriviledgedAccountCreation,
  });
};

module.exports = getAccounts;

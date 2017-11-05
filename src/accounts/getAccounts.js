
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
    generateToken: (username, password) => new Promise((resolve, reject) => {
        if (typeof(username) !== typeof('') || typeof(password) !== typeof('')){
          reject('invalid parameters');
        }else{
          users.isValidCredentials(username, password).then(() => {
            jwt.generateToken(username).then(resolve).catch(() => {
              reject('could  not generate token');
            });
          }).catch(() => {
            reject('invalid credentials');
          })
        }
    }),
    generateTokenFromToken: jwt.generateTokenWithToken,
    getUserForToken: jwt.getUserForToken,
    getUsers: users.getUsers,
    setProfileImage: users.setProfileImage,
    isAccountCreationAdminOnly: priviledgedAccountCreation.isAccountCreationPriviledged,
    enableAdminOnlyAccountCreation: priviledgedAccountCreation.enableNonPriviledgedAccountCreation,
    disableAdminOnlyAccountCreation: priviledgedAccountCreation.disableNonPriviledgedAccountCreation,
  });
};

module.exports = getAccounts;

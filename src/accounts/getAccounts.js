

const getUsers = require('./users/getUsers');
const getNonPriviledgedAccountCreation =  require('./non_priviledged_account_creation/priviledgedAccountCreation');

const getAccounts = db => {
  if (db === undefined){
    throw (new Error('accounts:getAccounts db not defined'));
  }

  const users = getUsers(db);
  const priviledgedAccountCreation = getNonPriviledgedAccountCreation(db);

  return ({
    createUser: users.createUser,
    deleteUser: users.deleteUser,
    isValidCredentials: users.isValidCredentials,
    generateToken: (username, password) => {
      return new Promise((resolve, reject) => {
        if (typeof(username) !== typeof('') || typeof(password) !== typeof('')){
          reject('invalid parameters');
        }else{
          users.isValidCredentials(username, password).then(() => {
            resolve('test token');
          }).catch(() => {
            reject('invalid token');
          })
        }
      });
    },
    getUserForToken: (token) => {
      return new Promise((resolve, reject) => {
        resolve('teset');
      });
    },
    getUsers: users.getUsers,
    setProfileImage: users.setProfileImage,
    isAccountCreationAdminOnly: priviledgedAccountCreation.isAccountCreationPriviledged,
    enableAdminOnlyAccountCreation: priviledgedAccountCreation.enableNonPriviledgedAccountCreation,
    disableAdminOnlyAccountCreation: priviledgedAccountCreation.disableNonPriviledgedAccountCreation,
  });
};

module.exports = getAccounts;

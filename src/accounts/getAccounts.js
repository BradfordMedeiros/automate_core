

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
    getUsers: users.getUsers,
    setProfileImage: users.setProfileImage,
    isAccountCreationAdminOnly: priviledgedAccountCreation.isAccountCreationPriviledged,
    enableAdminOnlyAccountCreation: priviledgedAccountCreation.enableNonPriviledgedAccountCreation,
    disableAdminOnlyAccountCreation: priviledgedAccountCreation.disableNonPriviledgedAccountCreation,
  });
};

module.exports = getAccounts;

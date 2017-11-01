
const getPriviledgedAccountCreation = db => {
  if (db === undefined){
    throw (new Error('accounts:non_priviledge_account_creation:getPriviledgedAccountCreation db not defined'));
  }

  const isAccountCreationPriviledged = (username, password) => {
    return new Promise((resolve, reject) => {
      db.open().then(database => {
        database.all(`select enabled from admin_only_account_creation limit 1`, (err, isEnabled) => {
          if (err){
            reject(err);
          }else{
            const firstRow = isEnabled[0];
            if (firstRow === undefined){
              reject('accounts creation error: isEnabledRow not defined. This is programming error');
            }else{
              const isEnabled = firstRow.enabled === 1;
              resolve(isEnabled);
            }
            resolve(isEnabled);
          }
        });
      }).catch(reject);
    });
  };

  const enableNonPriviledgedAccountCreation = (username) => {
    return new Promise((resolve, reject) => {
      db.open().then(database => {
        database.all(`INSERT OR REPLACE INTO admin_only_account_creation (oid, enabled) VALUES (1, 1)`, (err) => {
          if (err){
            reject(err);
          }else{
            resolve();
          }
        });
      }).catch(reject);
    });
  };

  const disableNonPriviledgedAccountCreation = () => {
    return new Promise((resolve, reject) => {
      db.open().then(database => {
        database.all(`INSERT OR REPLACE INTO admin_only_account_creation (oid, enabled) VALUES (1, 0)`, (err) => {
          if (err){
            reject(err);
          }else{
            resolve();
          }
        });
      }).catch(reject);
    });
  };

  return ({
    isAccountCreationPriviledged,
    enableNonPriviledgedAccountCreation,
    disableNonPriviledgedAccountCreation,
  });
};

module.exports = getPriviledgedAccountCreation;
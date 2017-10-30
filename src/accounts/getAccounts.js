

const crypto = require('crypto');


const getAccounts = db => {
  if (db === undefined){
    throw (new Error('accounts:getAccounts db not defined'));
  }

  const generateSalt = () => crypto.randomBytes(128).toString('base64');

  const hashPassword = (password, salt) => {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    hash.update(salt);
    return hash.digest('hex');
  };

  const getSaltForExistingUser = username => {
    return new Promise((resolve, reject) => {
      db.open().then(database => {
        database.all(`SELECT salt FROM users WHERE username = '${username}'`, (err, salts) => {
          if (err){
            reject(err);
          }else{
            if (salts.length === 0){
              reject('user does not exist');
            }
            resolve(salts[0].salt);
          }
        });
      }).catch(reject);
    });
  };

  const createUser = (username, password) => {
    const salt = generateSalt();
    const passwordHash = hashPassword(password, salt);

    return new Promise((resolve, reject) => {
      db.open().then(database => {
        database.all(`INSERT INTO users (username, password, salt) values ('${username}','${passwordHash}', '${salt}')`, (err) => {
          if (err){
            reject(err);
          }else{
            resolve();
          }
        });
      }).catch(reject);
    });
  };

  const deleteUser = (username) => {
    return new Promise((resolve, reject) => {
      db.open().then(database => {
        database.all(`DELETE from users WHERE username = ('${username}')`, (err) => {
          if (err){
            reject(err);
          }else{
            resolve();
          }
        });
      }).catch(reject);
    });
  };

  const isValidCredentials = (username, password) => {
    if (typeof(username) !== typeof('')){
      throw (new Error('username not defined'));
    }
    if (typeof(password) !== typeof('')){
      throw (new Error('password not defined'));
    }

    return new Promise((resolve, reject) => {
      getSaltForExistingUser(username).then(salt => {
        const hashedPassword = hashPassword(password, salt);
        db.open().then(database => {
          database.all(`SELECT username, password FROM users WHERE username = '${username}' and password = '${hashedPassword}'`, (err, users) => {
            if (err){
              reject(err);
            }else{
              if (users.length === 1){
                resolve();
              }else{
                reject();
              }
            }
          });
        }).catch(reject);
      }).catch(reject);
    });

  };

  const getUsers = () => {
    return new Promise((resolve, reject) => {
      db.open().then(database => {
        database.all(`SELECT username FROM users`, (err, users) => {
          if (err) {
            reject(err);
          } else {
            resolve(users);
          }
        });
      }).catch(reject);
    })
  };

  return ({
    createUser,
    deleteUser,
    isValidCredentials,
    getUsers,
  });
};

module.exports = getAccounts;

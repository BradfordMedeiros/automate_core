// this file handles storing user accounts, checking passwords, etc
// this should not do anything with user tokens

const crypto = require('crypto');

const getUsers = db => {
  if (db === undefined){
    throw (new Error('accounts:users:getUsers db not defined'));
  }

  const generateSalt = () => crypto.randomBytes(128).toString('base64');

  const hashPassword = (password, salt) => {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    hash.update(salt);
    return hash.digest('hex');
  };

  const getSaltForExistingUser = email => {
    return new Promise((resolve, reject) => {
      db.open().then(database => {
        database.all(`SELECT salt FROM users WHERE email = '${email}'`, (err, salts) => {
          if (err){
            reject(err);
          }else{
            if (salts.length === 0){
              reject('user does not exist');
            }else{
              resolve(salts[0].salt);
            }
          }
        });
      }).catch(reject);
    });
  };

  const getNumberOfUsers = () => new Promise((resolve, reject) => {
    db.open().then(database => {
      database.all(`SELECT count(*) as count FROM users`, (err, count) => {
        if (err) {
          reject(err);
        } else {
          resolve(count[0].count);
        }
      });
    }).catch(reject);
  });

  console.warn('@todo create user: need to verify alias is also unique');
  const createUser = (email, password, alias) => {
    return new Promise((resolve, reject) => {
      if (typeof(email) !== typeof('')){
        throw (new Error('email not defined'));
      }
      if (typeof(password) !== typeof('')){
        throw (new Error('password not defined'));
      }
      if (typeof(alias) !== typeof('')){
        throw (new Error('alias not defined'));
      }

      const salt = generateSalt();
      const passwordHash = hashPassword(password, salt);

      // if there is no user, the first user is the admin
      getNumberOfUsers().then(count => {
        const shouldMakeAdmin = count === 0;
        const adminValue = shouldMakeAdmin ? 1: 0;
        db.open().then(database => {
          database.all(`INSERT INTO users (email, password, salt, alias, is_admin) values ('${email}','${passwordHash}', '${salt}', '${alias}', ${adminValue})`, (err) => {
            if (err){
              reject(err);
            }else{
              resolve();
            }
          });
        }).catch(reject);
      }).catch(reject);
    });
  };

  const deleteUser = (email) => {
    return new Promise((resolve, reject) => {
      if (email !== typeof('')){
        throw (new Error('email not defined'));
      }
      db.open().then(database => {
        database.all(`DELETE from users WHERE email = ('${email}')`, (err) => {
          if (err){
            reject(err);
          }else{
            resolve();
          }
        });
      }).catch(reject);
    });
  };

  const isValidCredentials = (email, password) => {
    return new Promise((resolve, reject) => {
      if (typeof(email) !== typeof('')) {
        throw (new Error('email not defined'));
      }
      if (typeof(password) !== typeof('')) {
        throw (new Error('password not defined'));
      }

      getSaltForExistingUser(email).then(salt => {
        const hashedPassword = hashPassword(password, salt);
        db.open().then(database => {
          database.all(`SELECT email, password FROM users WHERE email = '${email}' and password = '${hashedPassword}'`, (err, users) => {
            if (err) {
              reject(err);
            } else {
              if (users.length === 1) {
                resolve();
              } else {
                reject();
              }
            }
          });
        }).catch(reject);
      }).catch(reject);
    });
  };

  const getUserHash = email =>  {
    return new Promise((resolve, reject) => {
      if (typeof(email) !== typeof('')){
        throw (new Error('email is undefined'));
      }

      db.open().then(database => {
        database.all(`SELECT password FROM users where email = '${email}' limit 1`, (err, users) => {
          if (err) {
            reject(err);
          } else {
            if (users.length === 0){
              reject('no user found');
            }else{
              const passwordHash = users[0].password;
              resolve(passwordHash);
            }
          }
        });
      }).catch(reject);
    })
  };

  const setPassword = (email, password) =>  {
    return new Promise((resolve, reject) => {
      if (typeof(email) !== typeof('')) {
        throw (new Error('email not defined'));
      }
      if (typeof(password) !== typeof('')) {
        throw (new Error('password not defined'));
      }

      const newSalt = generateSalt();
      const hashedPassword = hashPassword(password, newSalt);
      db.open().then(database => {
        database.all(`update users set password = '${hashedPassword}', salt = '${newSalt}' where email = '${email}'`, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }).catch(reject);
    });
  };

  const setProfileImage = (email, imageUrl) => {
    return new Promise((resolve, reject) => {
      if (typeof(email) !== typeof('')){
        throw (new Error('email not defined'));
      }
      if (typeof(imageUrl) !== typeof('')){
        throw (new Error('image url not defined'));
      }

      db.open().then(database => {
        database.all(`update users set imageUrl = '${imageUrl}' where email = '${email}'`, (err) => {
          if (err){
            reject(err);
          }else{
            resolve();
          }
        });
      }).catch(reject);
    });
  };

  const getAccountInformation = email => {
    return new Promise((resolve, reject) => {
      if (typeof(email) !== typeof('')){
        throw (new Error('email is undefined'));
      }

      db.open().then(database => {
        database.all(`SELECT email, alias, imageURL FROM users where email = '${email}' limit 1`, (err, users) => {
          if (err) {
            reject(err);
          } else {
            const user = users[0];
            if (user === undefined){
              reject('no user found');
            }else{
              resolve(user);
            }
          }
        });
      }).catch(reject);
    })
  };

  const getUsers = () => {
    return new Promise((resolve, reject) => {
      db.open().then(database => {
        database.all(`SELECT email, imageURL FROM users`, (err, users) => {
          if (err) {
            reject(err);
          } else {
            resolve(users);
          }
        });
      }).catch(reject);
    })
  };

  const isUserAdmin = email => new Promise((resolve, reject) => {
    if (typeof(email) !== typeof('')) {
      throw (new Error('email is undefined'));
    }

    db.open().then(database => {
      database.all(`SELECT is_admin FROM users where email = '${email}' limit 1`, (err, isAdminUser) => {
        if (err) {
          reject(err);
        } else {
          if (isAdminUser.length === 0){
            reject('no users found');
          }else{
            const isAdmin = (isAdminUser[0].is_admin === 1);
            resolve(isAdmin);
          }
        }
      });
    }).catch(reject);
  });

  return ({
    createUser,
    deleteUser,
    isValidCredentials,
    getUserHash,
    isUserAdmin,
    getUsers,
    setPassword,
    setProfileImage,
    getAccountInformation,
  });
};

module.exports = getUsers;
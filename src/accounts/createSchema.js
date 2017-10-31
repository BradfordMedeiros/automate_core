
const createSchema = db => new Promise((resolve, reject) => {
  db.open().then(database => {
    database.all(
      `CREATE TABLE users (
        id	INTEGER PRIMARY KEY AUTOINCREMENT,
        username	TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        salt TEXT NOT NULL,
        imageURL TEXT
      );`, (err) => {
        if (err){
          reject(err);
        }else{
          resolve();
        }
      });
  }).catch(reject);
});

module.exports = createSchema;

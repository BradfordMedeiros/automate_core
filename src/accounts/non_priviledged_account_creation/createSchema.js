
const createSchema = db => new Promise((resolve, reject) => {
  db.open().then(database => {
    database.all(
      `CREATE TABLE admin_only_account_creation (
        enabled	INTEGER NOT NULL
      );`, (err) => {
        if (err){
          reject(err);
        }else{
          database.all(
            `INSERT INTO 
                admin_only_account_creation 
             (enabled) 
                VALUES 
             (0);`, (err) => {
              if (err){
                reject(err);
              }else{
                resolve();
              }
            });
        };
      });
  }).catch(reject);
});

module.exports = createSchema;


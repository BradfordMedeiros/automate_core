

const express = require('express');
const databaseManager = require('../../../databaseManager');

const getDatabasesWithActive = () => new Promise((resolve, reject) => {
  const dbPromise = Promise.all([
    databaseManager.getDatabases(),
    databaseManager.getActiveDatabase()
  ]);
  dbPromise.then(values => {
    const databases = values[0].map(dbName => ({
      name: dbName,
      isActive: dbName === values[1],
    }));
    resolve(databases);
  }).catch(reject);
});


const create_routes = () => {
  const router = express();

  router.get('/', (req, res) => {
      getDatabasesWithActive().then(databases => {
        res.jsonp({ databases });
      }).catch(err => {
        res.jsonp({ error: err });
      })
  });

  router.post('/:databasename/set_as_active', (req,res) => {

  });

  router.get('/:database_name/download', (req, res) => {
    const database_name = req.params.database_name;
    const dbPath = databaseManager.getDatabasePath(database_name);
    res.sendFile(dbPath);
  });

  router.post('/:database_name/copy', (req,res) => {

  });

  router.delete('/:database_name', (req,res) => {
    const database_name = req.params.database_name;
    databaseManager.deleteDatabase(database_name).then(() => {
      res.status(200).send('ok');
    }).catch(err => {
      res.jsonp({ error: err });
    });
  });

  router.post('/:database_name/upload', (req,res) => {

  });


  return router;
};

module.exports = create_routes;

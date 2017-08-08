

const express = require('express');
const path = require('path');
const fs = require('fs');
const formidable = require('formidable');
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
        res.status(200).jsonp({ databases });
      }).catch(err => {
        res.status(400).jsonp({ error: err });
      })
  });

  router.post('/:databasename/set_as_active', (req,res) => {

  });

  router.get('/download/:database_name', (req, res) => {
    const database_name = req.params.database_name;
    const dbPath = databaseManager.getDatabasePath(database_name);
    res.sendFile(dbPath);
  });
  router.post('/:database_name', (req,res) => {
    const database_name = req.params.database_name;
    databaseManager.createDatabase(database_name).then(() => {
      res.status(200).send('ok');
    }).catch(err => {
      res.status(400).jsonp({ error: err });
    })
  });

  router.post('/:database_name/copy', (req,res) => {

  });

  router.delete('/:database_name', (req,res) => {
    const database_name = req.params.database_name;
    databaseManager.deleteDatabase(database_name).then(() => {
      res.status(200).send('ok');
    }).catch(err => {
      res.status(400).jsonp({ error: err });
    });
  });

  router.post('/upload/:database_name', (req,res) => {
    console.log('upload hit');
    const database_name = req.params.database_name;

    const form = new formidable.IncomingForm();

    form.uploadDir = path.resolve(`./databases/tmp`);

    form.parse(req, (err, fields, files) => {
      if (err){
        console.log('oh no error');
        res.status(400).jsonp({ error: 'internal server error' });
      }else{
        console.log('sup sall good');
        const fileName = Object.keys(files)[0];
        const oldpath = files[fileName].path;
        const newpath = path.resolve(`./databases/dbs/${database_name}`);

        console.log('old path: ', oldpath);
        console.log('new path: ', newpath);

        fs.rename(oldpath, newpath, function (err) {
          if (err){
            res.status(400).jsonp({ error: 'internal server error' });
          }else{
            res.send('ok');
          }
        });
      }
    });
  });


  return router;
};

module.exports = create_routes;

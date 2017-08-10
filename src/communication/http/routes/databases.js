

const express = require('express');
const path = require('path');
const fs = require('fs');
const formidable = require('formidable');

const getDatabasesWithActive = databaseManager => new Promise((resolve, reject) => {
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

const create_routes = databaseManager => {
  if(databaseManager === undefined){
    throw (new Error('http:create_routes:databases databaseManager must be defined'));
  }

  const router = express();

  router.get('/', (req, res) => {
      getDatabasesWithActive(databaseManager).then(databases => {
        res.status(200).jsonp({ databases });
      }).catch(err => {
        res.status(400).jsonp({ error: err });
      })
  });

  router.post('/set_as_active/:database_name', (req,res) => {
    const database_name = req.params.database_name;
    databaseManager.setActiveDatabase(database_name).then(() => {
      res.status(200).send('ok');
    }).catch(err => {
      res.status(400).jsonp({ error: err });
    });
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

  router.post('/copy/:database_name', (req,res) => {
    const target_database_name  = req.params.database_name;
    console.log(req.body);
    const database_name_to_copy = req.body.from;
    console.log('target db: ', target_database_name);
    console.log('to copy: ', database_name_to_copy);
    databaseManager.copyDatabase(database_name_to_copy, target_database_name).then(() =>{
      res.status(200).send('ok');
    }).catch(err => {
      res.status(400).jsonp({ error: err });
    });
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
        res.status(400).jsonp({ error: 'internal server error' });
      }else{
        const fileName = Object.keys(files)[0];
        const oldpath = files[fileName].path;
        const newpath = path.resolve(`./databases/dbs/${database_name}`);

        fs.rename(oldpath, newpath, function (err) {
          if (err){
            res.status(400).jsonp({ error: 'internal server error' });
          }else{
            databaseManager.addDatabase(database_name);
            res.send('ok');
          }
        });
      }
    });
  });


  return router;
};

module.exports = create_routes;

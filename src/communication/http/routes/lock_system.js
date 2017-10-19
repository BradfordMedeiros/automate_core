const express = require('express');

const create_routes = lockSystemManager => {
  if (lockSystemManager === undefined){
    throw (new Error('http:create_routes:lock_system lockSystemManager must be defined'));
  }

  const router = express();

  router.get('/', (req, res) => {
    lockSystemManager.isSystemLocked().then(isLocked => {
      res.send(isLocked);
    }).catch(() => {
      res.jsonp({ error: 'internal server error' });
    })
  });

  router.post('/', (req, res) => {
    lockSystemManager.lockSystem().then(() => {
      res.send('ok');
    }).catch(() => {
      res.jsonp({ error: 'internal server error' });
    })
  });

  return router;
};

module.exports = create_routes;


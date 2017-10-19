const express = require('express');

const create_routes = lockSystemManager => {
  if (lockSystemManager === undefined){
    throw (new Error('http:create_routes:lock_system lockSystemManager must be defined'));
  }

  const router = express();

  router.get('/', (req, res) => {
    lockSystemManager.getSystemLockedData().then(({ isLocked, systemName }) => {
      res.send({
        isLocked,
        systemName,
      });
    }).catch(() => {
      res.jsonp({ error: 'internal server error' });
    })
  });

  router.post('/', (req, res) => {
    const systemName = req.params.system_name;
    lockSystemManager.lockSystem().then(() => {
      res.send('ok');
    }).catch(() => {
      res.jsonp({ error: 'internal server error' });
    })
  });

  router.post('/:system_name', (req, res) => {
    const systemName = req.params.system_name;
    lockSystemManager.lockSystem(systemName).then(() => {
      res.send('ok');
    }).catch(() => {
      res.jsonp({ error: 'internal server error' });
    })
  });

  return router;
};

module.exports = create_routes;


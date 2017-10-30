
const express = require('express');

const create_routes = accounts => {
  a = accounts;
  if (accounts === undefined){
    throw (new Error('http:create_routes:accounts accounts must be defined'));
  }

  const router = express();

  router.get('/', (req, res) => {
    accounts.getUsers().then(users => {
      res.jsonp(users);
    }).catch(() => {
      res.status(400).jsonp({ error: 'internal server error' });
    });
  });

  router.post('/login', (req, res) => {
    req.isAuthenticated().then(() => {
      res.send('ok');
    }).catch(() => {
      res.status(403).jsonp({ error: 'invalid credentials' });
    });
  });

  router.post('/createUser', (req, res) => {
    accounts.createUser(req.body.username, req.body.password).then(() => {
      res.send('ok');
    }).catch(err => {
      console.log(err);
      res.status(400).jsonp({ error: 'internal server error' });

    });
  });

  return router;
};

module.exports = create_routes;
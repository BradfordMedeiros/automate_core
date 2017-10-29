
const express = require('express');

const create_routes = accounts => {
  if (accounts === undefined){
    throw (new Error('http:create_routes:accounts accounts must be defined'));
  }

  const router = express();

  router.get('/', (req, res) => {
    res.jsonp(accounts.getUsers());
  });

  router.post('/login', (req, res) => {
    if (req.isAuthenticated()){
      res.send('ok');
    }
    res.status(403);
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

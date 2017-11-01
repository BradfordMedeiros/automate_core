
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

  router.post('/setProfileImage', (req, res) => {
    accounts.setProfileImage(req.body.username, req.body.imageUrl).then(() => {
      res.send('ok');
    }).catch(err => {
      console.log(err);
      res.status(400).jsonp({ error: 'internal server error' });
    });
  });

  router.get('/isAccountCreationAdminOnly', (req, res) => {
    accounts.isAccountCreationAdminOnly().then(isAdminOnly => {
      res.jsonp(isAdminOnly);
    }).catch(err => {
      console.log(err);
      res.status(400).jsonp({ error: 'internal server error' });
    });
  });

  router.get('/myAccount', (req, res) => {
    res.jsonp({
      username: 'brad',
      email: 'bradmedeiros0@gmail.com',
      alias: 'cool user',
      admin: {
        allowAccountCreation: false,
        allowEmailReset: true,
      },
    });
  });

  return router;
};

module.exports = create_routes;

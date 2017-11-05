
const express = require('express');

const create_routes = accounts => {
  if (accounts === undefined){
    throw (new Error('http:create_routes:accounts accounts must be defined'));
  }

  const router = express();

  acc = accounts;

  router.get('/', (req, res) => {
    accounts.getUsers().then(users => {
      res.jsonp(users);
    }).catch(() => {
      res.status(400).jsonp({ error: 'internal server error' });
    });
  });

  router.post('/login', (req, res) => {
    accounts.generateToken(req.body.email, req.body.password).then(token => {
      res.jsonp({
        token,
      });
    }).catch(err => {
      res.status(403).jsonp({ error: 'invalid credentials' });
    });
  });

  router.post('/loginWithToken', (req, res) => {
    accounts.generateTokenFromToken(req.body.token).then(token => {
      res.jsonp({
        token,
      });
    }).catch(err => {
      res.status(400).jsonp({ error: 'internal server error' });
    });
  });

  router.post('/createUser', (req, res) => {
    accounts.createUser(req.body.email, req.body.password, req.body.alias).then(() => {
      res.send('ok');
    }).catch(err => {
      console.log(err);
      res.status(400).jsonp({ error: 'internal server error' });
    });
  });

  router.post('/setProfileImage', (req, res) => {
    accounts.setProfileImage(req.body.email, req.body.imageUrl).then(() => {
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

  router.post('/enableUserAccountCreation', (req, res) => {
    accounts.disableAdminOnlyAccountCreation().then(() => {
      res.send('ok');
    }).catch(err => {
      console.log(err);
      res.status(400).jsonp({ error: 'internal server error' });
    });
  });

  router.post('/disableUserAccountCreation', (req, res) => {
    accounts.enableAdminOnlyAccountCreation().then(() => {
      res.send('ok');
    }).catch(err => {
      console.log(err);
      res.status(400).jsonp({ error: 'internal server error' });
    });
  });

  router.post('/myAccount', (req, res) => {

    if (typeof(req.body.token) !== typeof('')){
      res.status(400).jsonp({ error: 'invalid parameters' });
      return;
    }

    const allData = Promise.all([
      accounts.isAccountCreationAdminOnly(),
      accounts.getUserForToken(req.body.token),
    ]);

    allData.then(data => {
      const allowAccountCreation = data[0] === false;
      const email = data[1];


      res.jsonp({
        email,
        alias: 'this is mocked, finish accounts routes',
        isAdmin: true,
        admin: {
          allowAccountCreation,
          allowEmailReset: true,
        },
      });
    }).catch(err => {
      console.log(err);
      res.status(400).jsonp({ error: 'internal server error' });
    });

  });

  return router;
};

module.exports = create_routes;

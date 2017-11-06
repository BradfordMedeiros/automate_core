
const express = require('express');

const create_routes = (accounts, email) => {
  if (accounts === undefined){
    throw (new Error('http:create_routes:accounts accounts must be defined'));
  }
  if (email === undefined){
    throw (new Error('http:create_routes:accounts email must be defined'));
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
    accounts.generateAuthToken(req.body.email, req.body.password).then(token => {
      res.jsonp({
        token,
      });
    }).catch(err => {
      res.status(403).jsonp({ error: 'invalid credentials' });
    });
  });

  router.post('/loginWithToken', (req, res) => {
    accounts.generateAuthTokenFromAuthToken(req.body.token).then(token => {
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
      accounts.getUserForAuthToken(req.body.token),
    ]);

    allData.then(data => {
      const allowAccountCreation = data[0] === false;
      const email = data[1];

      const accountInformationPromise = Promise.all([
        accounts.getNonSensitiveInfoForUser(email),
        accounts.isUserAdmin(email),
        accounts.isAccountCreationAdminOnly()
      ]);

      accountInformationPromise.then(data=> {
        const user = data[0];
        const isAdmin = data[1];
        const allowAccountCreation = !data[2];
        res.jsonp({
          email,
          alias: user.alias,
          imageURL: user.imageURL,
          isAdmin,
          admin: {
            allowAccountCreation,
          },
        });
      }).catch(err => {
        console.log(err);
        res.status(400).jsonp({ error: 'internal server error' });
      });
    }).catch(err => {
      console.log(err);
      res.status(400).jsonp({ error: 'internal server error' });
    });

  });

  router.post('/requestPasswordReset', (req, res) => {
    console.warn('hardcoding my email here for now, obviously needs to be changed');
    const userEmail = 'bradmedeiros0@gmail.com';

    accounts.generatePasswordResetToken(userEmail).then(token => {
      email.send_password_reset(userEmail, token).then(() => {
        res.send('ok');
      }).catch(err => {
        console.error(err);
        res.status(400).jsonp({ error: 'internal server error' });
      });
    }).catch(err => {
      console.error(err);
      res.status(400).jsonp({ error: 'internal server error' });
    });
  });

  router.post('/confirmResetPassword', (req, res) => {
    accounts.getUserForPasswordResetToken(req.body.token).then(email => {
      accounts.setPassword(email, req.body.new_password).then(() => {
        res.send('ok');
      }).catch(() => {
        res.status(400).jsonp({ error: 'internal server error' });
      });
    }).catch(err => {
      console.error(err);
      res.status(400).jsonp({ error: 'invalid credentials' });
    });
  });

  return router;
};

module.exports = create_routes;

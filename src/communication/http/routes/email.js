
const express = require('express');

const create_routes = emailManager => {
  if (emailManager === undefined){
    throw (new Error('email:create_routes emailManager not defined'));
  }

  const router = express();

  router.get('/', (req, res) => {

    const emailEnabled = emailManager.getIsEnabled();
    const emailAddress = emailManager.getEmail();

    emailManager.getEmailInfo().then(info => {
      res.jsonp({
        emailEnabled: info.isEnabled,
        emailAddress: info.emailAddress,
      });
    }).catch(() => {
      res.jsonp({ error: 'internal server error' });
    });
  });

  router.post('/enable', (req, res) => {
    emailManager.enable().then(() => {
      res.send('ok');
    }).catch(() => {
      res.jsonp({ error: 'internal server error' });
    });
  });

  router.post('/disable', (req, res) => {
    emailManager.disable().then(() => {
      res.send('ok');
    }).catch(() => {
      res.jsonp({ error: 'internal server error' });
    });
  });

  router.post('/address/:email', (req, res) => {
    const email = req.params.email;

    emailManager.setEmail(email).then(() => {
      res.send('ok');
    }).catch(() => {
      res.jsonp({ error: 'internal server error' });
    });
  });

  return router;
};

module.exports = create_routes;

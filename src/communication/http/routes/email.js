
const express = require('express');


let emailEnabled = false;
let emailAddress = '';

const create_routes = () => {

  const router = express();

  router.get('/', (req, res) => {
    res.jsonp({
      emailEnabled,
      emailAddress,
    });
  });

  router.post('/:email', (req, res) => {
    const email = req.params.email;
    emailAddress = email;
    res.send('ok');
  });

  router.post('/enable', (req, res) => {
    emailEnabled = true;
    res.send('ok');
  });

  router.post('/disable', (req, res) => {
    emailEnabled = false;
    res.send('ok');
  });

  return router;
};

module.exports = create_routes;

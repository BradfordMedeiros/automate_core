
const DEBUG_MAC_ADDRESS = '23:343:3432:34234';
const DEBUG_IP_ADDRESS = '128.232.312.231';

const express = require('express');

const create_routes = mongoDb => {
  const router = express();

  router.get('/ip', (req, res) => {
    res.send(DEBUG_IP_ADDRESS);
  });

  router.get('/mac', (req, res) => {
    res.send(DEBUG_MAC_ADDRESS);
  });

  router.get('/', (req, res) => {
    res.jsonp({
      macAddress: DEBUG_MAC_ADDRESS,
      ipAddress: DEBUG_IP_ADDRESS,
    })
  });

  return router;
};

module.exports = create_routes;

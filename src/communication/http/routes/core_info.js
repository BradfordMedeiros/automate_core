
const express = require('express');
const getNetworkInfo = require('../../../util/getNetworkInfo');

const create_routes = mongoDb => {
  const router = express();

  router.get('/', (req, res) => {
    getNetworkInfo(5000).then(info => {
      res.jsonp(info);
    }).catch(err => {
      res.status(500).jsonp({ error: 'network failure'});
    })
  });

  return router;
};

module.exports = create_routes;

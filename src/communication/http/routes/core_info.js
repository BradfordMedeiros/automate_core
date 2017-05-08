
const express = require('express');
const getNetworkInfo = require('../../../util/getNetworkInfo');

const create_routes = mongoDb => {
  const router = express();

  router.get('/', (req, res) => {
    getNetworkInfo(10000).then(info => {
      res.jsonp(info);
    }).catch(err => {
      console.log('timeout')
      res.status(500);
    })
  });

  return router;
};

module.exports = create_routes;

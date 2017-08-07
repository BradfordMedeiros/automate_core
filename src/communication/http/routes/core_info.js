
const express = require('express');
const getNetworkInfo = require('../../../util/getNetworkInfo');

const create_routes = () => {
  const router = express();

  router.get('/', (req, res) => {
    getNetworkInfo(5000).then(info => {
      const deviceInfo = info;
      deviceInfo.automate_core_version = '0.3';
      res.jsonp(deviceInfo);
    }).catch(err => {
      res.status(500).jsonp({ error: 'network failure'});
    })
  });

  return router;
};

module.exports = create_routes;

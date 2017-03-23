const express = require("express");
const bodyParser = require('body-parser');
const create_state_routes = require('./routes/states');
const create_action_routes = require('./routes/actions');
const create_condition_routes = require('./routes/conditions');

const create_routes = virtual_system => {
  const router = express();

  router.use(bodyParser.json( ));
  router.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));
  router.use(bodyParser.text({ type: 'text/html' }));

  router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  router.use('/states', create_state_routes(virtual_system));
  router.use('/actions', create_action_routes(virtual_system));
  router.use('/conditions', create_condition_routes(virtual_system));

  router.post('/reload', (req,res) => {
    virtual_system.load_virtual_system('./mock').then(() => res.send('ok')).catch(() => res.error());
  });

  router.get('/status', (req, res) => {
    res.jsonp({ status: 'ok' });
  });
  return router;
};

module.exports = create_routes;


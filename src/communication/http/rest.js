const express = require("express");
const bodyParser = require('body-parser');
const create_state_routes = require('./routes/system/states');
const create_action_routes = require('./routes/system/actions');
const create_condition_routes = require('./routes/system/conditions');
const create_sequences_routes =  require('./routes/system/sequences');
const create_event_routes = require('./routes/events');
const create_topic_routes = require('./routes/topics');
const create_core_info = require('./routes/core_info');
const create_static_routes = require('./routes/static_routes');

const create_routes = system => {
  if (system === undefined){
    throw (new Error('http:create_routes: system must be defined'));
  }

  const router = express();

  router.use(bodyParser.json());
  router.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));
  router.use(bodyParser.text({ type: 'text/html' }));

  router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
    next();
  });

  router.use(create_static_routes());
  router.use('/states', create_state_routes(system));
  router.use('/actions', create_action_routes(system));
  //router.use('/conditions', create_condition_routes(virtual_system));
  //router.use('/sequences', create_sequences_routes(virtual_system));
  router.use('/events', create_event_routes(system));
  //router.use('/topics', create_topic_routes(mongoDb));
  router.use('/info', create_core_info());

  router.get('/status', (req, res) => {
    res.jsonp({ status: 'ok' });
  });
  return router;
};

module.exports = create_routes;


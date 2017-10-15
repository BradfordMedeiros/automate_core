const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');

const create_state_routes = require('./routes/system/states');
const create_action_routes = require('./routes/system/actions');
const create_condition_routes = require('./routes/system/conditions');

const create_sequences_routes =  require('./routes/system/sequences');
const create_schedule_routes = require('./routes/system/schedules');
const create_rules_routes = require('./routes/system/rules');

const create_event_routes = require('./routes/events');
const create_topic_routes = require('./routes/topics');
const create_core_info = require('./routes/core_info');
const create_database_routes = require('./routes/databases');
const create_tile_routes =  require('./routes/tiles');
const create_static_routes = require('./routes/static_routes');
const create_env = require('./routes/system/env');
const create_email = require('./routes/email');

const create_routes = (system, databaseManager, tileManager) => {
  if (system === undefined){
    throw (new Error('http:create_routes: system must be defined'));
  }
  if (databaseManager === undefined){
    throw (new Error('http:create_routes: databaseManager must be defined'));
  }
  if (tileManager === undefined){
    throw (new Error('http:create_routes: tileManager must be defined'));
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

  router.get('/', (req, res) => res.sendFile(path.resolve('./public/index.html')));
  router.use('/states', create_state_routes(system));
  router.use('/actions', create_action_routes(system));
  router.use('/conditions', create_condition_routes(system));
  router.use('/sequences', create_sequences_routes(system));
  router.use('/schedules', create_schedule_routes(system));
  router.use('/rules', create_rules_routes(system));
  router.use('/events', create_event_routes(system));
  router.use('/topics', create_topic_routes(system));
  router.use('/env', create_env(system));
  router.use('/info', create_core_info());
  router.use('/databases', create_database_routes(databaseManager));
  router.use('/tiles', create_tile_routes(tileManager));
  router.use('/static', create_static_routes());
  router.use('/email', create_email());

  router.get('/status', (req, res) => {
    res.jsonp({ status: 'ok' });
  });
  return router;
};

module.exports = create_routes;


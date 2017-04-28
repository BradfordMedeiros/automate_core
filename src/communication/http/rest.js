const express = require("express");
const bodyParser = require('body-parser');
const create_state_routes = require('./routes/system/states');
const create_action_routes = require('./routes/system/actions');
const create_condition_routes = require('./routes/system/conditions');
const create_sequences_routes =  require('./routes/system/sequences');
const create_event_routes = require('./routes/events');
const create_topic_routes = require('./routes/topics');

const create_routes = (virtual_system, mongoDb) => {
  if (virtual_system === undefined) {
    throw (new Error('virtual system undefined in call to create routes'));
  }
  if (mongoDb === undefined){
    throw (new Error(' mongoDb undefined in call to create routes'));
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

  router.use('/states', create_state_routes(virtual_system));
  router.use('/actions', create_action_routes(virtual_system));
  router.use('/conditions', create_condition_routes(virtual_system));
  router.use('/sequences', create_sequences_routes(virtual_system));
  router.use('/events', create_event_routes(mongoDb));
  router.use('/topics', create_topic_routes(mongoDb));

  router.post('/reload', (req,res) => {
    virtual_system.load_virtual_system('./mock').then(() => res.send('ok')).catch(() => res.error());
  });

  router.get('/status', (req, res) => {
    res.jsonp({ status: 'ok' });
  });
  return router;
};

module.exports = create_routes;


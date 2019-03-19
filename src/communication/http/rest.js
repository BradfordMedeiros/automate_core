const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');

const create_account_routes = require('./routes/accounts');

const create_state_routes = require('./routes/system/states');
const create_action_routes = require('./routes/system/actions');

const create_actionscripts = require('./routes/system/actionscripts');
const create_sequences_routes =  require('./routes/system/sequences');
const create_event_routes = require('./routes/events');

const create_database_routes = require('./routes/databases');
const create_tile_routes =  require('./routes/tiles');
const create_static_routes = require('./routes/static_routes');
const create_lock_system_routes = require('./routes/lock_system');
const create_env = require('./routes/system/env');
const create_email = require('./routes/email');
const create_custom_theme_routes = require('./routes/custom_theme');

const create_routes = ({
  system,
  databaseManager,
  tileManager,
  emailManager,
  lockSystemManager,
  accounts,
  email,
  customTheme,
}) => {
  if (system === undefined){
    throw (new Error('http:create_routes: system must be defined'));
  }
  if (databaseManager === undefined){
    throw (new Error('http:create_routes: databaseManager must be defined'));
  }
  if (tileManager === undefined){
    throw (new Error('http:create_routes: tileManager must be defined'));
  }
  if (emailManager === undefined){
    throw (new Error('http:create_routes: emailManager must be defined'));
  }
  if (lockSystemManager === undefined){
    throw (new Error('http:create_routes: lockSystemManager must be defined'));
  }
  if (accounts === undefined){
    throw (new Error('http:create_routes: accounts must be defined'));
  }
  if (email === undefined){
    throw (new Error('http:create_routes: email must be defined'));
  }
  if (customTheme === undefined){
    throw (new Error('http:create_routes: customTheme must be defined'));
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
  router.use('/actionscripts', create_actionscripts(system));
  router.use('/sequences', create_sequences_routes(system));
  router.use('/events', create_event_routes(system));
  router.use('/env', create_env(system));
  router.use('/databases', create_database_routes(databaseManager));
  router.use('/tiles', create_tile_routes(tileManager));
  router.use('/static', create_static_routes());
  router.use('/email', create_email(emailManager));
  router.use('/lock', create_lock_system_routes(lockSystemManager));
  router.use('/accounts', create_account_routes(accounts, email));
  router.use('/theme', create_custom_theme_routes(customTheme));

  router.get('/status', (req, res) => {
    res.jsonp({ status: 'ok' });
  });
  return router;
};

module.exports = create_routes;



const express = require('express');
const path = require('path');

const create_routes = system => {
  if (system === undefined){
    throw (new Error('http:create_routes:states system must be defined'));
  }

  const router = express();

  const systemStates = system.baseSystem.states.getStates();
  const states  = Object.keys(systemStates).map(stateKey => ({
    topic: systemStates[stateKey].topic,
    value: systemStates[stateKey].value,
  }));

  router.get('/', (req, res) => {
    res.jsonp({
      states,
    });
  });

  return router;
};


module.exports = create_routes;
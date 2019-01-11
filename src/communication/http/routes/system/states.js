
const express = require('express');

const create_routes = system => {
  if (system === undefined){
    throw (new Error('http:create_routes:states system must be defined'));
  }

  const router = express();

  router.get('/', (req, res) => {
    const systemStates = system.baseSystem.states.getStates();
    const states  = Object.keys(systemStates).map(stateKey => ({
      topic: systemStates[stateKey].topic,
      value: systemStates[stateKey].value,
    }));

    res.jsonp({
      states,
    });
  });

  return router;
};


module.exports = create_routes;
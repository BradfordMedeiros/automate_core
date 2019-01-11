const express = require('express');

const create_routes = system => {
  if (system === undefined){
    throw (new Error('http:create_routes:actions system must be defined'));
  }

  const router = express();
  router.get('/', (req, res) => {
    const systemActions = system.baseSystem.actions.getActions();
    res.jsonp({
      actions: Object.keys(systemActions).map(actionName => ({
        name: actionName,
        value: systemActions[actionName].value,
      }))
    });
  });

  return router;
};


module.exports = create_routes;
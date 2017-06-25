
const express = require('express');

const create_routes = system => {
  if (system === undefined){
    throw (new Error('http:create_routes:events system must be defined'));
  }

  const router = express();

  router.get('/', (req, res) => {
    system.logging.events.getEvents().then(events => res.jsonp(events)).catch(() => res.status(500));
  });

  return router;
};

module.exports = create_routes;

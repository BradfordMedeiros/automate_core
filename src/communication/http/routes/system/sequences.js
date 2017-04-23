const express = require('express');

const create_routes = virtual_system => {
  const router = express();

  router.get('/', (req, res) => {
    const sequences = virtual_system.get_virtual_system().sequences.map(sequence => ({
      name: sequence.get_name(),
    }));

    const json = {
      sequences,
    };
    res.jsonp(json);
  });

  return router;
};


module.exports = create_routes;
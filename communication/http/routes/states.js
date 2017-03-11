const express = require('express');
const router = express();

const create_routes = virtual_system => {
  router.get('/', (req, res) => {
    const states = virtual_system.get_virtual_system().states.map(state => ({
      name: state.get_name(),
    }));

    const json = {
      states,
    };
    res.jsonp(json);
  });

  return router;
};


module.exports = create_routes;
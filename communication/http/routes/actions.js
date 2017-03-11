const express = require('express');
const router = express();

const create_routes = virtual_system => {
  router.get('/', (req, res) => {
    const actions = virtual_system.get_virtual_system().actions.map(action => ({
      name: action.get_name(),
    }));

    const json = {
      actions,
    };
    res.jsonp(json);
  });

  return router;
};


module.exports = create_routes;
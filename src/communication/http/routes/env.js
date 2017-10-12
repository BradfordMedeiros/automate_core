
const express = require('express');

const variables = {
  test: 'something',
  yes: 'wow',
};

const create_routes = system => {
  const router = express();

  router.get('/', (req, res) => {
    res.jsonp(variables);
  });

  router.post('/:variable/:value', (req, res) => {
    const variable = req.params.variable;
    const value = req.params.value;
    variables[variable] = value;
    res.send('ok');
  });

  router.delete('/:variable', (req, res) => {
    const variable = req.params.variable;
    delete variables[variable];
    res.send('ok');
  });

  return router;
};

module.exports = create_routes;


const express = require('express');

const create_routes = system => {
  if (system === undefined){
    throw (new Error('http:create_routes:env system must be defined'));
  }

  const router = express();

  router.get('/', (req, res) => {
    res.jsonp(system.env.getEnv());
  });

  router.get('/:variable', (req, res) => {
    const variable = req.params.variable;
    res.send(system.env.getEnv()[variable]);
  });

  router.post('/:variable/:value', (req, res) => {
    const variable = req.params.variable;
    const value = req.params.value;

    system.env.setEnv(variable, value).then(() => {
      res.send('ok');
    }).catch(err => {
      res.status(500).jsonp({ error: 'internal server error' });
    });
  });

  router.delete('/:variable', (req, res) => {
    const variable = req.params.variable;

    system.env.deleteEnv(variable).then(() => {
      res.send('ok');
    }).catch(err => {
      res.status(500).jsonp({ error: 'internal server error' });
    });
  });

  return router;
};

module.exports = create_routes;

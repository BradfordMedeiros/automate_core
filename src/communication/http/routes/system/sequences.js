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

  router.post('/modify/:sequence_name', (req, res) => {
    if (req.body === undefined){
      res.status(400).jsonp({ error: 'invalid parameters' });
      return;
    }

    const name = req.params.sequence_name;
    const actions = req.body.actions;
    virtual_system.add_sequence(name, actions || []);
    res.status(200).send('ok');
  });

  /*router.delete('/:state_name', (req, res) => {
    const states = virtual_system.get_virtual_system()
      .state.filter(condition => condition.get_name() === req.params.state_name);
    if (states.length === 0){
      res.status(404).jsonp({ error: "state not found" });
      return;
    }
    else if (states.length > 1){
      res.status(500).jsonp({ error: 'internal server error'});
      return;
    }

    const state = states[0];
    virtual_system.delete_state(state.get_name()).then(() => {
      res.status(200).send('ok');
    }).catch(() => {
      res.status(500).send({ error: 'internal server error' });
    });
  });*/

  return router;
};


module.exports = create_routes;
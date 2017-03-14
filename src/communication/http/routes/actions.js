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

  router.post('/:action_name', (req, res) => {
    const actions = virtual_system.get_virtual_system()
      .actions
      .filter(action => action.get_name() === req.params.action_name);

    if (actions.length === 0){
      res.status(404).jsonp({ error: "action not found" });
      return;
    }
    else if (actions.length === 0){
      res.status(500).jsonp({ error: 'internal server error'});
      return;
    }

    const action = actions[0];
    action.execute().then(result => res.jsonp(result)).catch(() => res.status(500));
  });

  router.post('/modify/:action_name', (req, res) => {
    if (req.body === undefined){
      res.status(400).jsonp({ error: 'invalid parameters' });
      return;
    }

    const name = req.params.action_name;
    const actionEval = req.body.actionEval;
    virtual_system.add_action(name, `(${actionEval})()`);
    res.status(200).send('ok');
  });

  return router;
};


module.exports = create_routes;
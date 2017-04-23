const express = require('express');
const fse = require('fs-extra');
const path = require('path');

const create_routes = virtual_system => {
  const router = express();

  router.get('/', (req, res) => {
    const conditions = virtual_system.get_virtual_system().conditions.map(condition => ({
      name: condition.get_name(),
      state: condition.get_state(),
      file: JSON.parse(fse.readFileSync(condition.path)),
    }));
    const json = {
      conditions,
    };
    res.jsonp(json);
  });

  router.get('/:condition_name', (req, res) => {
    const conditions = virtual_system.get_virtual_system()
      .conditions
      .filter(condition => condition.get_name() === req.params.condition_name);

    if (conditions.length === 0){
      res.status(404).jsonp({ error: "condition not found" });
      return;
    }
    else if (conditions.length === 0){
      res.status(500).jsonp({ error: 'internal server error'});
      return;
    }

    const json = JSON.parse(fse.readFileSync(conditions[0].path, 'utf-8'));
    res.jsonp(json);
  });

  router.post('/:condition_name/', (req, res) => {
    if (req.body === undefined){
      res.status(400).jsonp({ error: 'invalid parameters' });
      return;
    }

    console.log('body is ', req.body);
    const name = req.params.condition_name;
    const parameters = req.body;
    virtual_system.add_condition(name, parameters);
    res.status(200).send('ok');
  });

  router.delete('/:condition_name', (req, res) => {
    const conditions = virtual_system.get_virtual_system()
      .conditions.filter(condition => condition.get_name() === req.params.condition_name);
    if (conditions.length === 0){
      res.status(404).jsonp({ error: "condition not found" });
      return;
    }
    else if (conditions.length > 1){
      res.status(500).jsonp({ error: 'internal server error'});
      return;
    }

    const condition = conditions[0];
    virtual_system.delete_condition(condition.get_name()).then(() => {
      res.status(200).send('ok');
    }).catch(() => {
      res.status(500).send({ error: 'internal server error' });
    });
  });

  return router;
};


module.exports = create_routes;
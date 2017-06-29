
const express = require('express');
const path = require('path');

const create_routes = system => {
  if (system === undefined){
    throw (new Error('http:create_routes:conditions system must be defined'));
  }

  const router = express();

  router.get('/', (req, res) => {
    const systemConditions = system.baseSystem.conditions.getConditions();

    const conditionsArray = Object.keys(systemConditions).map(conditionName => {
      return ({
        name: conditionName,
        type: 'javascript',
        content: systemConditions[conditionName].evalString,
      })
    });
    res.jsonp({
      conditions: conditionsArray,
    });
  });

  router.post('/modify/*', (req, res) => {
    if (req.body === undefined){
      res.status(400).jsonp({ error: 'invalid parameters' });
      return;
    }

    const name = path.relative('/modify/conditions/', req.url);
    const conditionEval = req.body.conditionEval;

    if (system.baseSystem.conditions.getConditions()[name]){
      system.baseSystem.conditions.deleteCondition(name).then(() => {
        system.baseSystem.conditions.addCondition(name, conditionEval ? conditionEval : 'return false').then(() => {
          res.status(200).send('ok');
        }).catch(() => {
          res.status(500).jsonp({ error: 'internal server error' })
        });
      }).catch(() => {
        res.status(500).jsonp({ error: 'internal server error' })
      });
    }else{
      system.baseSystem.conditions.addCondition(name, conditionEval ? conditionEval : 'return false').then(() => {
        res.status(200).send('ok');
      }).catch(() => {
        res.status(500).jsonp({ error: 'internal server error' })
      });
    }
  });

  router.delete('/*', (req, res) => {
    const name = path.relative('/', req.url);

    if (system.baseSystem.conditions.getConditions()[name]){
      system.baseSystem.conditions.deleteCondition(name).then(() => {
        res.status(200).send('ok');
      }).catch(() => res.status(500).jsonp({ error: 'internal server error' }));
    }
    else{
      res.status(200).send('ok');
    }
  });

  return router;
};


module.exports = create_routes;
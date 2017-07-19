const express = require('express');
const path = require('path');

const create_routes = system => {
  if (system === undefined){
    throw (new Error('http:create_routes:rules system must be defined'));
  }

  const router = express();

  router.get('/', (req, res) => {
    const systemRules = system.engines.ruleEngine.getRules();

    const rulesArray = Object.keys(systemRules).map(ruleName => {
      return ({
        name: ruleName,
        conditionName: systemRules[ruleName].conditionName,
        strategy: systemRules[ruleName].strategy,
        rate: systemRules[ruleName].rate,
        topic: systemRules[ruleName].topic,
        value: systemRules[ruleName].value,
      })
    });
    res.jsonp({
      rules: rulesArray,
    });
  });

  router.post('/modify/*', (req, res) => {
    if (req.body === undefined){
      res.status(400).jsonp({ error: 'invalid parameters' });
      return;
    }

    const name = path.relative('/modify/rules/', req.url);
    const conditionName = req.body.conditionName || Object.keys(system.baseSystem.conditions.getConditions())[0];
    const strategy = req.body.strategy || 'positive-edge';
    const rate = req.body.rate ? Number(req.body.rate): 1000;
    const topic = req.body.topic || '';
    const value = req.body.value || '';

    if (system.engines.ruleEngine.getRules()[name]){
      console.log('adding rule: ', name);
      system.engines.ruleEngine.deleteRule(name).then(() => {
        console.log('deleting rule ', name);
        system.engines.ruleEngine.addRule(name, conditionName, strategy, rate, topic, value).then(() => {
          console.log('added rule successfully: ', name);
          res.status(200).send('ok');
        }).catch(() => {
          console.log('error---0');
          res.status(500).jsonp({ error: 'internal server error' })
        });
      }).catch(() => {
        console.log('error---1');
        res.status(500).jsonp({ error: 'internal server error' })
      });
    }else{
      console.log('adding rule here');
      system.engines.ruleEngine.addRule(name, conditionName, strategy, rate, topic, value).then(() => {
        console.log('---add rule here successfully ----');
        res.status(200).send('ok');
      }).catch(() => {
        console.log('---error rule adding here' );
        res.status(500).jsonp({ error: 'internal server error' })
      });
    }
  });

  router.delete('/*', (req, res) => {
    const name = path.relative('/', req.url);

    if (system.engines.ruleEngine.getRules()[name]){
      system.engines.ruleEngine.deleteRule(name).then(() => {
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
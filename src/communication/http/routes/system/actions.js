const express = require('express');
const path = require('path');

const createActionScriptContent = (system, name, topic, script, toTopic) => {
  const actionScript = system.engines.actionScriptEngine.getActionScripts()[name];
  if (actionScript === undefined){
    return system.engines.actionScriptEngine.addActionScript(name, topic, script, toTopic);
  }else{
    console.log('tur');
    return new Promise((resolve, reject) => {
      system.engines.actionScriptEngine.deleteActionScript(name).then(() => {
        system.engines.actionScriptEngine.addActionScript(name, topic, script, toTopic).then(resolve).catch(reject);
      }).catch(reject);
    });
  }
};

const create_routes = system => {
  if (system === undefined){
    throw (new Error('http:create_routes:states system must be defined'));
  }


  const router = express();
  router.get('/', (req, res) => {
    const systemActions = system.baseSystem.actions.getActions();

    const actionsArray = Object.keys(systemActions).map(actionName => {
      const hasActionScript = system.engines.actionScriptEngine.getActionScripts()[actionName] !== undefined;

      return ({
        name: actionName,
        type: hasActionScript ? 'javascript' : 'mqtt',
        content: (hasActionScript ?
          'test':
          'no data')
      })
    });
    res.jsonp({
      actions: actionsArray,
    });
  });

  router.post('/modify/*', (req, res) => {
    if (req.body === undefined){
      res.status(400).jsonp({ error: 'invalid parameters' });
      return;
    }

    const name = path.relative('/modify', req.url);
    const actionEval = req.body.actionEval;

    if (system.baseSystem.actions.getActions()[name] === undefined){
      system.baseSystem.actions.forceAddAction(path.relative('actions', name)).then(() => {
        createActionScriptContent(system, name, name, actionEval || '', `action_scripts/${name}`).then(() => {
          res.status(200).send('ok');
        }).catch(() => {
          res.status(500).jsonp({ error: '1internal server error' })
        })
      }).catch(() => {
        res.status(500).jsonp({ error: '2internal server error' })
      });
    }else{
      createActionScriptContent(system, name, name, actionEval || '', `action_scripts/${name}`).then(() => {
        res.status(200).send('ok');
      }).catch(() => {
        res.status(500).jsonp({ error: '3internal server error' })
      })
    }
  });

  router.delete('/*', (req, res) => {
    const name = path.relative('/', req.url);

    if (system.engines.actionScriptEngine.getActionScripts()[name]){
      system.engines.actionScriptEngine.deleteActionScript(name).then(() => {
        res.status(200).send('ok');
      }).catch(res.status(500).jsonp({ error: 'internal server error' }));
    }else{
      res.status(200).send('ok');
    }
  });

  return router;
};


module.exports = create_routes;
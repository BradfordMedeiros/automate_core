const express = require('express');
const path = require('path');
const assert = require('assert');

const create_routes = system => {
  if (system === undefined){
    throw (new Error('http:create_routes:actionscripts system must be defined'));
  }

  const router = express();

  router.get('/', (req, res) => {
    const actionScripts = system.engines.actionScriptEngine.getActionScripts();
    const actionScriptArray = Object.keys(actionScripts).map(scriptKey => actionScripts[scriptKey])
    res.jsonp(actionScriptArray);
  });
 
  router.post('/modify/*', (req, res) => {
    if (req.body === undefined){
      res.status(400).jsonp({ error: 'invalid parameters' });
      return;
    }

    const name = path.relative('/modify/', req.url);
    const topic = req.body.topic;
    const toTopic = req.body.toTopic;
    const script = req.body.script;

    assert(name !== undefined);
    assert(topic !== undefined);
    assert(toTopic !== undefined);
    assert(script !== undefined);

    system.engines.actionScriptEngine.addActionScript(name, topic, script, toTopic).then(() => {
      res.send('ok')
    }).catch(() => {
      res.status(400).jsonp({ error: "Error adding action script" });
    })
  });

  router.delete('/*', (req, res) => {
    const name = path.relative('/', req.url);
    assert(name !== undefined);
    system.engines.actionScriptEngine.deleteActionScript(name).then(() => {
      res.send('ok');
    }).catch(() => {
      res.status(400).jsonp({ error: "Error deleting action script" });
    });
  });

  return router;
};


module.exports = create_routes;
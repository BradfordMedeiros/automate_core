const express = require('express');
const path = require('path');

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

    const name = path.relative('/modify/actionscripts/', req.url);
    const topic = req.body.topic;
    const toTopic = req.body.toTopic;
    const script = req.body.script;

    assert(name !== undefined);
    assert(topic !== undefined);
    assert(toTopic !== undefined);
    assert(script !== undefined);

    res.jsonp({
      value: 'ok',
    })
  });

  router.delete('/*', (req, res) => {
    const name = path.relative('/', req.url);
    assert(name !== undefined);
    res.jsonp({
      value: 'ok'
    });
  });

  return router;
};


module.exports = create_routes;
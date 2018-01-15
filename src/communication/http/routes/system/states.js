
const express = require('express');
const path = require('path');

const create_routes = system => {
  if (system === undefined){
    throw (new Error('http:create_routes:states system must be defined'));
  }

  const router = express();

  router.get('/', (req, res) => {

    const systemStates = system.baseSystem.states.getStates();

    const statesArray = Object.keys(systemStates).map(stateName => {
      const hasStateScript = system.engines.stateScriptEngine.getStateScripts()[stateName] !== undefined;
      return ({
        name: stateName,
        type: hasStateScript ? 'javascript': 'mqtt',
        content: (hasStateScript?
                    system.engines.stateScriptEngine.getStateScripts()[stateName].evalString:
                    'no data'),
        rate:  (hasStateScript?
          system.engines.stateScriptEngine.getStateScripts()[stateName].rate:
          null),
    })
    });
    res.jsonp({
      states: statesArray,
    });
  });

  router.post('/modify/*', (req, res) => {
     if (req.body === undefined){
        res.status(400).jsonp({ error: 'invalid parameters' });
        return;
     }

     const name = path.relative('/modify', req.url);
     const stateEval = req.body.stateEval;
     const rate = Number(req.body.rate);

     const handleError = () => res.status(500).jsonp({ error: 'internal server error' });
     const handleOk = () => res.status(200).send('ok');

    if (system.engines.stateScriptEngine.getStateScripts()[name]){
       system.engines.stateScriptEngine.deleteStateScript(name).then(() => {
         system.engines.stateScriptEngine.addStateScript(name, name, stateEval ? stateEval : '', rate).then(handleOk).catch(handleError);
       }).catch(handleError);
     }else{
       system.engines.stateScriptEngine.addStateScript(name, name, stateEval ? stateEval : '', rate).then(handleOk).catch(handleError);
     }
  });

  router.delete('/*', (req, res) => {
    const name = path.relative('/', req.url);

    if (system.engines.stateScriptEngine.getStateScripts()[name]){
      system.engines.stateScriptEngine.deleteStateScript(name).then(() => {
        system.baseSystem.states.unregister(name);
        res.status(200).send('ok');
      }).catch(() => res.status(500).jsonp({ error: 'internal server error' }));
    }else{
      system.baseSystem.states.unregister(name);
      res.status(200).send('ok');
    }
  });

  return router;
};


module.exports = create_routes;
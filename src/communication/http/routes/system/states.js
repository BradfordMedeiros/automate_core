
const express = require('express');

const create_routes = system => {
  if (system === undefined){
    throw (new Error('http:create_routes:states system must be defined'));
  }

  const router = express();

  router.get('/', (req, res) => {

    const systemStates = system.baseSystem.states.getStates();

    const statesArray = Object.keys(systemStates).map(stateName => {
      const hasStateScript = system.engines.stateScriptEngine.getStateScripts()[stateName] !== undefined;
      console.log('statename: has statescript? : ', stateName, ' : ', hasStateScript);
      return ({
        name: stateName,
        type: hasStateScript ? 'javascript': 'mqtt',
        content: (hasStateScript?
                    system.engines.stateScriptEngine.getStateScripts()[stateName].evalString:
                    'no data'),
      })
    });

    res.jsonp({
      states: statesArray,
    });
  });

  router.post('/modify/:state_name', (req, res) => {
     if (req.body === undefined){
        res.status(400).jsonp({ error: 'invalid parameters' });
        return;
     }

     const name = req.params.state_name;
     const stateEval = req.body.stateEval;
     if (system.engines.stateScriptEngine.getStateScripts()[name]){
        res.status(500).jsonp({ error: `statescript ${name} already exists`})
       return;
     }

     if (stateEval === undefined){
       system.engines.stateScriptEngine.addStateScript(`states/${name}`, `states/${name}`, '');
     }else{
       system.engines.stateScriptEngine.addStateScript(`states/${name}`, `states/${name}`, stateEval);
     }

     res.status(200).send('ok');
  });

  router.delete('/:state_name', (req, res) => {
    const states = virtual_system.get_virtual_system()
      .states.filter(state => state.get_name() === req.params.state_name);
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
      console.log('error while deleting state');
      res.status(500).send({ error: 'internal server error' });
    });
  });

  return router;
};


module.exports = create_routes;
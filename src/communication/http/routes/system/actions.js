const natural = require('natural');
const express = require('express');
const fs = require('fs');

const readFilePromise = filePath => new Promise((resolve, reject) => {
  fs.readFile(filePath, (err, value) => {
    if (err){
      reject(err);
    }else{
      resolve(value.toString())
    }
  })
});

const create_routes = virtual_system => {
  const router = express();

  router.get('/', (req, res) => {

    const systemActions = virtual_system.get_virtual_system().actions;
    const fileReadContentPromise  = Promise.all(systemActions.map(action => readFilePromise(action.path)));
    fileReadContentPromise.then(fileContent => {
      const actions = systemActions.map((action, index) => ({
        name: action.get_name(),
        type: action.get_type(),
        content: fileContent[index],
      }));
      const json = {
        actions,
      };
      res.jsonp(json);

    }).catch((err) => {
      console.log('rejecteddd');
      console.log(err);
      throw(err)
    });


  });

  router.post('/:action_name', (req, res) => {
    const actions = virtual_system.get_virtual_system()
      .actions
      .filter(action => action.get_name() === req.params.action_name);

    if (actions.length === 0) {
      res.status(404).jsonp({error: "action not found"});
      return;
    }
    else if (actions.length === 0) {
      res.status(500).jsonp({error: 'internal server error'});
      return;
    }

    const action = actions[0];
    action.execute().then(result => res.jsonp(result)).catch(() => res.status(500));
  });

  router.delete('/:action_name', (req, res) => {
    const actions = virtual_system.get_virtual_system()
      .actions.filter(action=> action.get_name() === req.params.action_name);
    if (actions.length === 0){
      res.status(404).jsonp({ error: "aciton not found" });
      return;
    }
    else if (actions.length > 1){
      res.status(500).jsonp({ error: 'internal server error'});
      return;
    }
    virtual_system.delete_action(actions[0].get_name()).then(() => {
      res.status(200).send('ok');
    }).catch(() => {
      res.status(500).send({ error: 'internal server error' });
    });
  });

  router.post('/modify/:action_name', (req, res) => {
    if (req.body === undefined) {
      res.status(400).jsonp({error: 'invalid parameters'});
      return;
    }

    const name = req.params.action_name;
    const actionEval = req.body.actionEval;
    virtual_system.add_action(name, `(${actionEval})()`);
    res.status(200).send('ok');
  });

  router.post('/special/speech_recognition', (req, res) => {
    const THRESHOLD = 0.6;

    if (virtual_system.get_virtual_system().actions.length === 0){
      res.jsonp({ response: 'no actions to perform'}).status(500);
      return;
    }
    const action_to_perform = req.body.speech;
    if (action_to_perform === undefined){
      res.jsonp({ response: 'invalid parameters' }).status(500);
      return;
    }

    const distances = virtual_system
      .get_virtual_system()
      .actions
      .map(action =>
        natural.JaroWinklerDistance(
          action.get_name(),
          action_to_perform
        )
      );
    const maxValue = distances.reduce(
      (currentMax, currentVal, currentIndex) => {
        if (currentVal > currentMax.max) {
          return {
            max: currentVal,
            index: currentIndex,
          }
        } else {
          return currentMax;
        }
      }, {max: distances[0], index: 0});

    const action =  virtual_system.get_virtual_system().actions[maxValue.index];
    if (maxValue.max > THRESHOLD) {
      action.execute();
      res.jsonp({ executed: true, action: action.get_name(), confidence: maxValue.max });
      return;
    }
    res.jsonp({ executed: false, action: action.get_name(), confidence: maxValue.max });
  });

  return router;
};


module.exports = create_routes;
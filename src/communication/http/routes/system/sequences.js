const express = require('express');

const create_routes = system => {
  if (system === undefined){
    throw (new Error('http:create_routes:sequences system must be defined'));
  }

  const router = express();

  router.get('/', (req, res) => {
    s = system;
    const sequences = system.engines.sequenceEngine.getSequences();
    const sequenceObjects = Object.keys(sequences).map(sequenceName => ({
      name: sequenceName,
      actions: system.engines.sequenceEngine.getSequences()[sequenceName].sequenceParts.map(x => ({
        name: x.type,
        value: x.options,
      })),
    }));

    const json = {
      sequences: sequenceObjects
    };

    res.jsonp(json);
  });

  router.post('/:sequence_name', (req, res) => {
    /*const sequences = virtual_system.get_virtual_system()
      .sequences
      .filter(sequence => sequence.get_name() === req.params.sequence_name);

    if (sequences.length === 0) {
      res.status(404).jsonp({error: "action not found"});
      return;
    }
    else if (sequences.length === 0) {
      res.status(500).jsonp({error: 'internal server error'});
      return;
    }

    const sequence = sequences[0];
    sequence.execute().then(result => res.jsonp(result)).catch(() => res.status(500));*/
  });

  router.post('/modify/:sequence_name', (req, res) => {
    /*if (req.body === undefined){
      res.status(400).jsonp({ error: 'invalid parameters' });
      return;
    }

    const name = req.params.sequence_name;
    const actions = req.body.actions;
    virtual_system.add_sequence(name, actions || []);
    res.status(200).send('ok');*/
  });

  router.delete('/:sequence_name', (req, res) => {
    /*const sequences = virtual_system.get_virtual_system()
      .sequences.filter(sequence => sequence.get_name() === req.params.sequence_name);
    if (sequences.length === 0){
      res.status(404).jsonp({ error: "sequence not found" });
      return;
    }
    else if (sequences.length > 1){
      res.status(500).jsonp({ error: 'internal server error'});
      return;
    }

    virtual_system.delete_sequence(sequences[0].get_name()).then(() => {
      res.status(200).send('ok');
    }).catch(() => {
      res.status(500).send({ error: 'internal server error' });
    });*/
  });

  return router;
};


module.exports = create_routes;
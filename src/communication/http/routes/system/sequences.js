const express = require('express');
const path = require('path');

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

  router.post('/modify/*', (req, res) => {
    const sequenceName = path.relative('/modify/sequences/', req.url);

    const sequenceActions = req.body.actions;

    if (system.engines.sequenceEngine.getSequences()[sequenceName]){
      system.engines.sequenceEngine.deleteSequence(sequenceName).then(() => {
        system.engines.sequenceEngine.addSequence(sequenceName, []).then(() => {
          res.status(200).send('ok');
        }).catch(() => {
          res.status(400).jsonp({ error: 'internal server error' });
        })
      }).catch(() => {
        res.status(400).jsonp({ error: 'internal server error' });
      });
    }else {
      system.engines.sequenceEngine.addSequence(sequenceName, []).then(() => {
        res.status(200).send('ok');
      }).catch(() => {
        res.status(400).jsonp({ error: 'internal server error' });
      });
    }
  });

  router.delete('/*', (req, res) => {
    const sequenceName = path.relative('/sequences/', req.url);

    console.log('url is: ', req.url);
    console.log('will delete: ', sequenceName);
    system.engines.sequenceEngine.deleteSequence(sequenceName).then(() => {
      res.status(200).send('ok');
    }).catch(() => {
      res.status(400).jsonp({ error: 'internal server error' });
    });
  });

  return router;
};


module.exports = create_routes;
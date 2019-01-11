const express = require('express');
const path = require('path');

const create_routes = system => {
  if (system === undefined){
    throw (new Error('http:create_routes:sequences system must be defined'));
  }

  const router = express();

  router.get('/', (req, res) => {
    const sequences = system.engines.sequenceEngine.getSequences();
    const sequenceObjects = Object.keys(sequences).map(sequenceName => ({
      name: sequenceName,
      actions: system.engines.sequenceEngine.getSequences()[sequenceName].sequenceParts.map(x => ({
        type: x.type,
        options: x.options,
      })),
    }));

    const json = {
      sequences: sequenceObjects
    };

    res.jsonp(json);
  });

  router.post('/modify/*', (req, res) => {
    const sequenceName = path.relative('/modify/sequences/', req.url);

    const sequenceActions = req.body.actions;
    if (system.engines.sequenceEngine.getSequences()[sequenceName]){
      system.engines.sequenceEngine.deleteSequence(sequenceName).then(() => {
        console.log('deleted');
        system.engines.sequenceEngine.addSequence(sequenceName, sequenceActions || []).then(() => {
          console.log('added');
          res.status(200).send('ok');
        }).catch(() => {
          console.log('valid sequence');
          res.status(400).jsonp({ error: 'internal server error' });
        })
      }).catch(() => {
        res.status(400).jsonp({ error: 'internal server error' });
      });
    }else {
      system.engines.sequenceEngine.addSequence(sequenceName, sequenceActions || [] ).then(() => {
        res.status(200).send('ok');
      }).catch(() => {
        res.status(400).jsonp({ error: 'internal server error' });
      });
    }
  });

  router.delete('/*', (req, res) => {
    const sequenceName = path.relative('/sequences/', req.url);
    system.engines.sequenceEngine.deleteSequence(sequenceName).then(() => {
      res.status(200).send('ok');
    }).catch(() => {
      res.status(400).jsonp({ error: 'internal server error' });
    });
  });

  return router;
};


module.exports = create_routes;
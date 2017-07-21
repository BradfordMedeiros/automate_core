
const express = require('express');

const create_routes = system => {
  if (system === undefined){
    throw (new Error('http:create_routes:topics system must be defined'));
  }

  const router = express();

  router.get('/:topic/:limit', (req,res) => {
    const limit = Number(req.params.limit);
    const topic = req.params.topic;
    system.logging.history.getHistory({ topic, limit }).then(result => {
      res.status(200).jsonp(result);
    }).catch(err => {
      res.status(500).jsonp({ error: 'internal server error' });
    });
  });

  router.get('/:topic_or_limit', (req, res) => {
    const param = req.params.topic_or_limit;
    if (Number.isNaN((Number(param)))){
      system.logging.history.getHistory({ topic: param  }).then(result => {
        res.status(200).jsonp(result);
      }).catch(err => {
        res.status(500).jsonp({ error: 'internal server error' });
      });
    }else{
      system.logging.history.getHistory({ limit: param }).then(result => {
        res.status(200).jsonp(result);
      }).catch(err => {
        res.status(500).jsonp({ error: 'internal server error' });
      });
    }
  });

  return router;
};

module.exports = create_routes;

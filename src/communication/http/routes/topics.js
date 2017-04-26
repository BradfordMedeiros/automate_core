
const express = require('express');

const create_routes = mongoDb => {
  const router = express();

  router.get('/:topic/:limit', (req,res) => {
    const limit = Number(req.params.limit);
    const topic = req.params.topic;
    mongoDb.collection('topics').find({ topic }).sort({ _id: -1 }).limit(limit).toArray().then(val => res.jsonp(val)).catch(() => res.status(500));
  });

  router.get('/:topic_or_limit', (req, res) => {
    const param = req.params.topic_or_limit;
    if (Number.isNaN((Number(param)))){
      mongoDb.collection('topics').find({ topic : param }).sort({ _id : -1 }).limit(10).toArray().then(val => res.send(val)).catch(() => res.status(500));
    }else{
      mongoDb.collection('topics').find({ }).sort({ _id: -1 }).limit(Number(param)).toArray().then(val => res.jsonp(val)).catch(() => res.status(500));
    }
  });

  router.post('/', (req, res) => {
    const query = req.body.query;
    const options = req.body.options;
    mongoDb.collection('topics').find(query, options).toArray().then(val => res.jsonp(val)).catch(() => res.status(500));
  });


  return router;
};

module.exports = create_routes;


const express = require('express');
const path = require('path');

const create_routes = () => {
  const router = express();
  router.use(express.static(path.resolve('./public')));
  return router;
};

module.exports = create_routes;

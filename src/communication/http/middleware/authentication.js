
// this introduces tight coupling
// so far only accounts is reliant on this

const express = require('express');

const createMiddleware = accounts => {
  if (typeof(accounts) !== typeof({})){
    throw (new Error('account undefined: must be object'));
  }

  const router = express();

  router.use((req, res, next) => {
    req.isAuthenticated = () => {
      return accounts.isValidCredentials(req.body.username, req.body.password);
    };
    next();
  });

  return router;
};

module.exports = createMiddleware;
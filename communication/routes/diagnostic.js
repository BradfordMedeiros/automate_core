
const express = require("express");
const router = express();

router.get('/diagnostic', (req,res) => {
  res.jsonp({ status: 'ok' });
});

module.exports = router;
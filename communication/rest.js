/*
 POST: /conditions/condition/:condition_name
 {
 state: <x>
 eval: <y>
 action: <z>
 }
 DELETE: /conditions/conditions/:condition_name
 GET: /condition/conditions/:condition_name
 */

const PORT = 9000;

const express = require("express");
const bodyParser = require('body-parser');
const fse = require('fs-extra');

const router = express();

const model = function(get_conditions, add_condition, delete_condition) {
  this.get_conditions = get_conditions;
  this.add_condition = add_condition;
  this.delete_condition = delete_condition;
};

model.prototype.getConditions = function(req,res){
  const conditions = this.get_conditions().map(condition => ({
    name: condition.get_name(),
    state: condition.get_state(),
    file: JSON.parse(fse.readFileSync(condition.path)),
  }));
  const json = {
    conditions,
  };
  res.jsonp(json);
};

model.prototype.get = function(req, res) {
  const conditions = this.get_conditions().filter(condition => condition.get_name() === req.params.condition_name);

  console.log('conditions ', conditions.length);
  if (conditions.length === 0){
    res.status(404).jsonp({ error: "condition not found" });
    return;
  }
  else if (conditions.length === 0){
    res.status(500).jsonp({ error: 'internal server error'});
    return;
  }

  const json = JSON.parse(fse.readFileSync(conditions[0].path, 'utf-8'));
  res.jsonp(json);
};
model.prototype.delete = function(req,res) {
  const conditions = this.get_conditions().filter(condition => condition.get_name() === req.params.condition_name);
  if (conditions.length === 0){
    res.status(404).jsonp({ error: "condition not found" });
    return;
  }
  else if (conditions.length > 1){
    res.status(500).jsonp({ error: 'internal server error'});
    return;
  }

  const condition = conditions[0];
  this.delete_condition(condition).then(() => {
    res.status(200).send('ok');
  }).catch(() => {
    res.status(500).send({ error: 'internal server error' });
  });
};
model.prototype.post = function(req,res) {
  console.log('getting post');
  if (req.body === undefined){
    res.status(400).jsonp({ error: 'invalid parameters' });
    return;
  }

  console.log('body is ', req.body);
  const name = req.params.condition_name;
  const parameters = req.body;
  this.add_condition(name, parameters);
  res.status(200).send('ok');
};

let modelToUse = undefined;

// parse various different custom JSON types as JSON
router.use(bodyParser.json( ));

// parse some custom thing into a Buffer
router.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))

// parse an HTML body into a string
router.use(bodyParser.text({ type: 'text/html' }))

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.get('/conditions/', (req, res) => {
  modelToUse.getConditions(req,res);
});

router.get('/conditions/:condition_name', (req, res) => {
  console.log('get condition yay');
  modelToUse.get(req,res);
});

router.post('/conditions/:condition_name/', (req, res) => {
  console.log('got post');
 modelToUse.post(req,res);
});

router.delete('/conditions/:condition_name', (req, res) => {
  modelToUse.delete(req,res);
});

router.get('/diagnostic', (req,res) => {
  res.jsonp({ status: 'ok' });
});


let serverInit = false;
const create_rest = (get_conditions, add_condition, delete_condition) => {
  if (!serverInit){
    router.listen(PORT, () => console.log('rest on port ', PORT));
    serverInit = true;
  }
  modelToUse = new model(get_conditions, add_condition, delete_condition);
};

module.exports = create_rest;

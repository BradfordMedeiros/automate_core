
const fs = require('fs');
const getTopicName = require('../util/getAxiomTopic');


const transformScriptToFunction = stateString => {
  const stateFunction =  (
    `() => { 
        ${stateString} 
     }`
  );
  return stateFunction;
};

const generateIsTrue = filePath => {
  const fileValue = fs.readFileSync(filePath).toString();
  const stateEval =  eval(transformScriptToFunction(fileValue));
  return stateEval;
};

const loadStateScript = (filePath, stateScriptFolder) => {
  const get_value = generateIsTrue(filePath);
  return ({
    path: filePath,
    get_name:  () => getTopicName(filePath, stateScriptFolder),
    get_value,
  });
};

module.exports = loadStateScript;


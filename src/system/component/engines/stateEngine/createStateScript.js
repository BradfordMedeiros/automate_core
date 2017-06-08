
const fs = require('fs');

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

const loadStateScript = filePath => {
  const get_value = generateIsTrue(filePath);
  return ({
    path: filePath,
    get_value,
  });
};

module.exports = loadStateScript;


const fs = require('fs');
const getAxiomName = require('../util/getAxiomName');

const transformConditionFileToFunction = conditionString => {
  const conditionFunction =  (
    `() => { 
        ${conditionString} 
     }`
  );
  return conditionFunction;
};

const generateIsTrue = filePath => {
  const fileValue = fs.readFileSync(filePath).toString();
  const conditionEval =  eval(transformConditionFileToFunction(fileValue));
  return conditionEval;
};

const loadCondition = filePath => {
  const get_name = () => getAxiomName(filePath);
  const is_true = generateIsTrue(filePath);
  return ({
    path: filePath,
    is_true,
    get_name,
  });
};

module.exports = loadCondition;




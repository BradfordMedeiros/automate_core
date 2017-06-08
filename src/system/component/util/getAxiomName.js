
const path = require('path');

const getAxiomName = (filePath, axiomFolder) => {
  console.log(axiomFolder);
  console.log(filePath);
  const topic = path.relative(path.resolve(axiomFolder,'..'), filePath);
  console.log('topic: ', topic);
  return topic;
};

module.exports = getAxiomName;
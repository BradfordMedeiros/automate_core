
const path = require('path');

const getAxiomName = (filePath, axiomFolder) => {
  const topic = path.relative(path.resolve(axiomFolder,'..'), filePath);
  return topic;
};

module.exports = getAxiomName;
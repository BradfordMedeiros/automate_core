
const fs = require('fs');
const getAxiomName = require('../util/getAxiomName');
const getFileType = require('../util/getFileType');
const writeFileValue = require('../util/writeFileValue');

const loadAction = (filePath, sysConditionFolder) => {
  const execute = value => writeFileValue(filePath, value);
  const get_name = () => getAxiomName(filePath, sysConditionFolder);
  const get_type = () => getFileType(filePath);
  return ({
    path: filePath,
    execute,
    get_name,
    get_type,
  });
};

module.exports = loadAction;




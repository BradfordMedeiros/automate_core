
const fs = require('fs');
const getFileValue = require('../util/getFileValue');
const getAxiomName = require('../util/getAxiomName');
const getFileType = require('../util/getFileType');

const loadState = (filePath, sysConditionFolder) => {
  const get_state = () => getFileValue(filePath);
  const get_name = () => getAxiomName(filePath, sysConditionFolder);
  const get_type = () => getFileType(filePath);
  return ({
    path: filePath,
    get_state,
    get_name,
    get_type,
  });
};

module.exports = loadState;




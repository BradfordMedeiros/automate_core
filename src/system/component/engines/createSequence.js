/**
 * Created by brad on 6/2/17.
 */
/*

 path: '/home/brad/automate/automate_core/mock/sequences/other.sequence.js',
 get_name: [Function],
 actions: [],
 execute: [Fu


 */


const fs = require('fs');r
//const getFileValue = require('../util/getFileValue');
const getAxiomName = require('../util/getAxiomName');
//const getFileType = require('../util/getFileType');

const loadSequence = filePath => {
  const execute = () => { };
  const get_name = () => getAxiomName(filePath);
  const actions = [ ];
  return ({
    path: filePath,
    actions,
    execute,
  });
};

module.exports = loadSequence;




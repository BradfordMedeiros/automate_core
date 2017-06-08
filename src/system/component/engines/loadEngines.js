const path = require('path');
const loadStateEngine = require('./stateEngine/loadStateEngine');

const loadEngines = enginePath => {
  console.log('loading engines');
  let stateEngine = undefined;

  console.log('path is: ', path.resolve(enginePath, 'states'));
  const stateEnginePromise = loadStateEngine(path.resolve(enginePath,'states')).then(se => {
    console.log('finished loading state engine');
    stateEngine = se;
    console.log('state engine is: ', stateEngine);
  }).catch(() => {
    console.log('---------- could not load state engine');
  });

  return new Promise((resolve, reject) => {
    Promise.all([stateEnginePromise]).then(() => {
      console.log('all engines finished loading');
      resolve({
        stateEngine: stateEngine,
        actionEngine: {
          start: () => { },
          stop: () => { },
        },
        rulesEngine: {
          start: () => { },
          stop: () => { },
        }
      });
    }).catch(reject)
  });

};

module.exports = loadEngines;
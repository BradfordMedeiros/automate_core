
const wetty = require('wetty');

const startWetty = port => {
  return (
    new Promise((resolve, reject) => {
      let wettyStarted = false;
      const handle = setTimeout(() => {
        reject();
      }, 4000);

      wetty.startSSH({port: 9001}, {
        onServerListen: () => {
          clearTimeout(handle);
          resolve();
        }
      });
    })
  )
};



module.exports = startWetty;

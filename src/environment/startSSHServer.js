
const wetty = require('wetty');

const startWetty = port => {
  return (
    new Promise((resolve, reject) => {
      const handle = setTimeout(() => {
        reject();
      }, 4000);

      let hasErrored = false;
      wetty.startSSH({ port }, {
        onServerListen: () => {
          clearTimeout(handle);
          resolve();
        },
        onTerminalError: () => {
          if (!hasErrored){
            hasErrored = true;
            reject();
          }
        }
      });
    })
  )
};



module.exports = startWetty;

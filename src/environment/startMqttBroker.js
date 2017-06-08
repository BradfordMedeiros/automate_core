const mosca = require('mosca');

//https://github.com/mcollina/mosca/blob/master/examples/Server_With_All_Interfaces-Settings.js
const startMqttBroker = () => {
  const moscaSetting = {

    persistence: { factory: mosca.persistence.Memory },

    interfaces: [
      { type: "mqtt", port: 1883 },
      { type: "http", port: 4000 },
    ],
  };

  return (new Promise((resolve, reject) => {
    const server = new mosca.Server(moscaSetting);

    server.on('ready', () => {
      resolve();
    });

    server.on("error", function (err) {
      reject(err);
    });
  }));

};

module.exports = startMqttBroker;

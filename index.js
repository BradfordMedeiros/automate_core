
const automate_system = require('automate_system');
const create_routes = require('./src/communication/http/rest');
const startSSHServer = require('./src/environment/startSSHServer');
const sendEmail = require('./src/util/email/sendEmail');

const PORT = 9000;

startSSHServer(9001)
automate_system.init({
  resourceFile: './automate.db',
  mqtt: {
    // need to add: mqttIp
    useInternalBroker: true,
    mqttPort: 1883,
    httpPort: 4000,
  },
  httpBridge: {
    enabled: true,
    port: 4001,
  },
  onEvent: ({ eventName, message }) => {
    sendEmail('bradmedeiros0@gmail.com', message);
  } ,
}).then(system => {
  const router = create_routes(system);
  router.listen(PORT, () => console.log("Server start on port " + PORT));
});

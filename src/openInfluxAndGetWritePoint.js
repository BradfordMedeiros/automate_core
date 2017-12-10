const Influx = require('influx');

let influx = undefined;
const openInfluxAndGetWritePoint = () => {
  if  (influx === undefined){
    influx = new Influx.InfluxDB({
      host: 'localhost',
      database: 'automate',
    });
  }

  const createDatabaseIfDoesNotExist = () => {
    console.warn('need to check if db exists, else create it');
  };

  createDatabaseIfDoesNotExist();

  const writeTopic = (topic, value) => new Promise((resolve, reject) => {
    influx.writePoints([
      {
        measurement: topic,
        fields: { value },
      }
    ]).then(resolve).catch(reject);
  });

  return writeTopic;
};

module.exports = openInfluxAndGetWritePoint;
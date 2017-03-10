
/*
      condition: <on/off>
 */



const mqtt =  require('mqtt');
const MQTT_URL = 'http://127.0.0.1:1883';

const client = mqtt.connect(MQTT_URL);

client.on('connect', () => {
  console.log('mqtt client connected');
});

const prefix = '/automate_sys/req/';
client.subscribe(prefix + '#');

client.on('message', (topic, message) => {
  console.log('got a message for ', topic);
  if (topic.indexOf(prefix) >= 0){
    console.log('pushing to handlers');
    callbackHandlers.forEach(callback => {
      const topicName = getConditionNameFromTopic(topic);
      p = topic;
      t = topicName;
      callback(getConditionNameFromTopic(topic),  message.toString());
    });
  }
});

const log_mqtt_message = mongo => (topic, message) => {
  console.log('logging mqtt message');
  mongo.collection('topics').insertOne({ topic, message: message.toString() });
};


const callbackHandlers = [ ];
const onConditionToggle = callback => {
  callbackHandlers.push(callback);
};


const getConditionNameFromTopic = topic => {
  const split_topics = topic.split('/').filter(x => x.length > 0);
  return split_topics[split_topics.length -1 ];
};


const getNameForCondition = conditionName => {
  return '/automate_sys/info/conditions/' + conditionName;
};

const publishCondition = (conditionName, state) => {
  console.log('publishing conditoin: ' , conditionName);
  client.publish(getNameForCondition(conditionName),  state);
};

const publishConditionNames = conditions => {
  conditions.forEach(condition => publishCondition(condition.get_name(), condition.get_state()));
};

const get_condition_names = conditions => {
  const condition_names = conditions.map(condition => condition.get_name());
  return condition_names;
};

module.exports  =  {
  publishConditionNames,
  onConditionToggle,
  get_condition_names,
};





















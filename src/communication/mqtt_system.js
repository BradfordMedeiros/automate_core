
const mqtt =  require('mqtt');
const MQTT_URL = 'http://127.0.0.1:1883';
const client = mqtt.connect(MQTT_URL);

const AUTOMATE_TOPIC_PREFIX = '/automate_sys/req/';
const send_email = require('./email/email');

client.subscribe(AUTOMATE_TOPIC_PREFIX + '#');
client.subscribe('/event/' + '#');
client.on('message', (topic, message) => {
  if (topic.indexOf(AUTOMATE_TOPIC_PREFIX) >= 0){
    callbackHandlers.forEach(callback => {
      const topicName = getConditionNameFromTopic(topic);
      callback(getConditionNameFromTopic(topic),  message.toString());
    });
  }

  if (topic.split('/').filter(x => x.length > 0)[0] === 'event'){
    send_email(
      'bradmedeiros0@gmail.com',
      'topic '+ topic +  '<hr>message: '+message
    );
  }
});

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





















const express = require('express');
const path = require('path');

const create_routes = system => {
  if (system === undefined){
    throw (new Error('http:create_routes:schedules system must be defined'));
  }

  const router = express();

  router.get('/', (req, res) => {
    s = system;
    const systemSchedules = system.engines.schedulerEngine.getSchedules();

    const schedulesArray = Object.keys(systemSchedules).map(scheduleName => {
      return ({
        name: scheduleName,
        type: 'javascript',
        content: systemSchedules[scheduleName].schedule,
      })
    });
    res.jsonp({
      schedules: schedulesArray,
    });
  });

  router.post('/modify/*', (req, res) => {
    if (req.body === undefined){
      res.status(400).jsonp({ error: 'invalid parameters' });
      return;
    }

    const name = path.relative('/modify/schedules/', req.url);

    console.log('schedule to add is: ', name);
    const schedule = req.body.schedule || '* * * * *';
    const scheduleTopic = req.body.topic  || '';
    const scheduleValue = req.body.value || '';

    if (system.engines.schedulerEngine.getSchedules()[name]){
      system.engines.schedulerEngine.deleteSchedule(name).then(() => {
        system.engines.schedulerEngine.addSchedule(name, schedule, scheduleTopic, scheduleValue).then(() => {
          res.status(200).send('ok');
        }).catch(() => {
          res.status(500).jsonp({ error: 'internal server error' })
        });
      }).catch(() => {
        res.status(500).jsonp({ error: 'internal server error' })
      });
    }else{
      system.engines.schedulerEngine.addSchedule(name, schedule, scheduleTopic, scheduleValue).then(() => {
        res.status(200).send('ok');
      }).catch(() => {
        res.status(500).jsonp({ error: 'internal server error' })
      });
    }
  });

  router.delete('/*', (req, res) => {
    const name = path.relative('/', req.url);

    if (system.engines.schedulerEngine.getSchedules()[name]){
      system.engines.schedulerEngine.deleteSchedule(name).then(() => {
        res.status(200).send('ok');
      }).catch(() => res.status(500).jsonp({ error: 'internal server error' }));
    }
    else{
      res.status(200).send('ok');
    }
  });

  return router;
};


module.exports = create_routes;
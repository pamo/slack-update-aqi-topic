
const { WebClient } = require('@slack/client');
const rp = require('request-promise');
const express = require('express');
const app = express();

const slackToken = process.env.SLACK_TOKEN;
const anToken = process.env.AIR_NOW_TOKEN;
const banterRoomId = 'C6FM3H36K';

const web = new WebClient(slackToken);

const updateTopic = (topic) => {
  web.channels.setTopic({ channel: banterRoomId, topic: topic })
    .then((res) => {
      console.log('topic set to: ', res);
    })
    .catch(console.error);
};

const airNowOptions = {
    uri: 'http://www.airnowapi.org/aq/observation/zipCode/current',
    qs: {
      distance: '10',
      format:'application/json',
      zipCode:'94103',
      API_KEY: anToken,
    },
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true 

};

const getAQIForSF = () => {
  rp(airNowOptions).then((response) => {
    const { ReportingArea: area, AQI, Category: category } = response[1];
    const { Name: status, Number: level } = category;
    
    const colorMap = {
      1: ':green_heart:',    
      2: ':yellow_heart:',
      3: ':large_orange_diamond:',
      4: ':red_circle:',
      5: ':purple_heart:',
      6: ':fire:'
    }
    
    let emotion;
    
    if(parseInt(level) >= 3) {
      emotion = ':mask:';
    } else {
      emotion = ':sunglasses:';
    }
    
    const topic = `${colorMap[parseInt(level)]} *AQI* for ${area} is currently ${AQI} (${status} ${emotion} )`;
    console.log(topic)
    updateTopic(topic);
  })
  .catch(console.error);
};

const threeHours = 10800000;
setInterval(getAQIForSF, threeHours);
require('dotenv').config();
const { WebClient } = require('@slack/client');

const slackToken = process.env.SLACK_TOKEN;
const channelId = process.env.CHANNEL_ID;

const web = new WebClient(slackToken);

export const updateSlackChannelTopic = topic => {
  return web.channels
    .setTopic({ channel: channelId, topic: topic })
    .then(response => {
      console.log(response);
    })
    .catch(console.error);
};

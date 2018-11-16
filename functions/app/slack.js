const { WebClient } = require('@slack/client');

const slackToken = process.env.SLACK_TOKEN;
const channelId = process.env.CHANNEL_ID;

const web = new WebClient(slackToken);

export const updateSlackChannelTopic = topic => {
  web.channels
    .setTopic({ channel: channelId, topic: topic })
    .then(res => {
      console.log('topic set to: ', res);
    })
    .catch(console.error);
};

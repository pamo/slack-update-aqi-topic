import { updateSlackChannelTopic } from './slack';
import { getAQIForZip } from './aqi';

const generateTopic = data => {
  const { status, level, area, aqi } = data;
  const aqiEmojiMap = {
    1: ':green_heart:',
    2: ':yellow_heart:',
    3: ':large_orange_diamond:',
    4: ':red_circle:',
    5: ':purple_heart:',
    6: ':fire:'
  };

  let emotion;

  if (parseInt(level) >= 3) {
    emotion = ':mask:';
  } else {
    emotion = ':sunglasses:';
  }

  return `${
    aqiEmojiMap[parseInt(level)]
  } *AQI* for ${area} is currently ${aqi} (${status} ${emotion} )`;
};

export default function app(callback) {
  getAQIForZip('94103').then(
    data => {
      updateSlackChannelTopic(generateTopic(data));
      callback(null, { statusCode: 200, body: generateTopic(data) });
    },
    error => callback({ statusCode: 422, body: String(error) })
  );
}

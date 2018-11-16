import { updateSlackChannelTopic } from './slack';
import { getAQIForZip } from './aqi';

const generateTopic = ({ level, aqi, status, area }) => {
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

export default function app() {
  const threeHours = 10800000;
  return new Promise((resolve, reject) => {
    setInterval(() => {
      getAQIForZip().then(data => {
        updateSlackChannelTopic(generateTopic(data));
        resolve(data);
      }, reject);
    }, threeHours);
  });
}

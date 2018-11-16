import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import logger from '../utils/logger';
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

export default function expressApp(functionName) {
  const app = express();
  const router = express.Router();

  const routerBasePath =
    process.env.NODE_ENV === 'dev'
      ? `/${functionName}`
      : `/.netlify/functions/${functionName}/`;

  app.use(morgan(logger));
  app.use(routerBasePath, router);
  router.use(cors());

  const threeHours = 10800000;
  setInterval(() => {
    getAQIForZip().then(
      data => updateSlackChannelTopic(generateTopic(data)),
      console.error
    );
  }, threeHours);

  return app;
}

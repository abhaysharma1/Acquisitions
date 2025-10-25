import arcjet, { shield, detectBot, slidingWindow } from '@arcjet/node';
import 'dotenv/config';

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: 'LIVE' }),
    detectBot({
      mode: process.env.ARCJET_MODE,
      allow: ['CATEGORY:SEARCH_ENGINE'],
    }),
    slidingWindow({
      mode: process.env.ARCJET_MODE,
      interval: '2s',
      max: 5,
    }),
  ],
});

export default aj;

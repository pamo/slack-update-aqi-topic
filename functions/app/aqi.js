const rp = require('request-promise');
const airNowToken = process.env.AIR_NOW_TOKEN;

const apiRequestOptions = (zipCode = '94013') => ({
  uri: 'http://www.airnowapi.org/aq/observation/zipCode/current',
  qs: {
    distance: '10',
    format: 'application/json',
    zipCode,
    API_KEY: airNowToken
  },
  headers: {
    'User-Agent': 'Request-Promise'
  },
  json: true
});

export const getAQIForZip = zipCode => {
  const request = rp(apiRequestOptions(zipCode));
  request
    .then(response => {
      const { ReportingArea: area, AQI: aqi, Category: category } = response[1];
      const { Name: status, Number: level } = category;
      return {
        status,
        level,
        category,
        area,
        aqi
      };
    })
    .catch(console.error);
  return request;
};

import app from './app';

// We need to define our function name for express routes to set the correct base path
const functionName = 'slack-aqi';

// Export Lambda handler
exports.handler = (event, context) => {
  console.log('doing the thing');
  return app()
    .then(data => ({
      statusCode: 200,
      body: `${data}`
    }))
    .catch(error => ({ statusCode: 422, body: String(error) }));
};

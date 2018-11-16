import awsServerlessExpress from 'aws-serverless-express';
import binaryMimeTypes from './utils/mime-types';
import expressApp from './app';

// We need to define our function name for express routes to set the correct base path
const functionName = 'slack-aqi';

// Initialize express app
const app = expressApp(functionName);

// Initialize awsServerlessExpress
const server = awsServerlessExpress.createServer(app, null, binaryMimeTypes);

// Export Lambda handler
exports.handler = (event, context) => {
  return awsServerlessExpress.proxy(server, event, context);
};

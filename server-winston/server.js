// Include for console debugging opentelemetry
//const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');
//diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
// end of debugging opentelemetry
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const winston = require('winston');
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-proto');
const { LoggerProvider, BatchLogRecordProcessor } = require('@opentelemetry/sdk-logs');
const {
  detectResourcesSync,
  envDetectorSync,
  processDetectorSync,
  hostDetectorSync
} = require('@opentelemetry/resources');
const logsAPI = require('@opentelemetry/api-logs');

// This code is required because auto-instrumentations-node doesn't support auto configuring logs,
// See https://github.com/open-telemetry/opentelemetry-js/issues/4552
const logExporter = new OTLPLogExporter();
const loggerProvider = new LoggerProvider({
// without resource we don't have proper service.name, service.version correlated with logs
  resource: detectResourcesSync({
// this have to be manually adjusted to match SDK OTEL_NODE_RESOURCE_DETECTORS
    detectors: [envDetectorSync, processDetectorSync, hostDetectorSync],
  }),
});

loggerProvider.addLogRecordProcessor(
  new BatchLogRecordProcessor(logExporter)
);
logsAPI.logs.setGlobalLoggerProvider(loggerProvider);

// Winston set up however is desired
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    }),
  ],
});

const app = express();

app.options('/api/customers', cors())

app.get('/api/customers', cors(), (req, res) => {
  const customers = [
    {id: 1, firstName: 'John', lastName: 'Doe'},
    {id: 2, firstName: 'Brad', lastName: 'Traversy'},
    {id: 3, firstName: 'Mary', lastName: 'Swanson'},
  ];

  logger.info('This is a test of a log message');
  res.json(customers);
});

const port = 5001;

app.listen(port, () => `Server running on port ${port}`);

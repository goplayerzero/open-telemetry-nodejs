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
// this has to be manually adjusted to match SDK OTEL_NODE_RESOURCE_DETECTORS
// See https://open-telemetry.github.io/opentelemetry-js/modules/_opentelemetry_resources.html
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

module.exports = logger;
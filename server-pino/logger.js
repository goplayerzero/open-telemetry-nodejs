const pino = require('pino');

const transport = pino.transport({
  targets: [
    {
      target: 'pino-opentelemetry-transport',
      options: {
        logRecordProcessorOptions: [
          {
            recordProcessorType: 'batch',
            exporterOptions: { protocol: 'http/protobuf' }
          },
          {
            recordProcessorType: 'simple',
            exporterOptions: { protocol: 'console' }
          }
        ],
        loggerName: 'test-logger',
        serviceVersion: '1.0.0'
      }
    }
  ]
})

const logger = pino(
  {
    level: 'debug',
    timestamp: true
  },
  transport
)

module.exports = logger;
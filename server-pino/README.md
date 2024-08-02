# Express Pino OpenTelemetry Starter



This example shows how to instrument a NodeJS Express backend that uses
Pino logging.

## Quick Start

``` bash
# Install dependencies for server
npm install

# Edit .env configuration to add your playerzero token

# Run the Express server
npm run start

# Run the Express server with Nodemon which monitors for changes
npm run server

# Server runs on http://localhost:5000
```

## App Info

This uses the OpenTelemetry auto-instrumentations-node package (see https://www.npmjs.com/package/@opentelemetry/auto-instrumentations-node) in order to
set up OpenTelemetry logging.

To configure this auto instrumentation, you'll need environment variables, along with requiring the 
auto-instrumentations-node package before Node runs.

If you want to use dotenv (see https://www.npmjs.com/package/dotenv), you need to require that before the
auto-instrumentations-node require.

You can add these requires to either an environment variable, or on the 
node command line.<br>

### With dotenv

With dotenv and using an environment variable to set requires

```bash
export NODE_OPTIONS="--require dotenv/config --require @opentelemetry/auto-instrumentations-node/register"
node server.js
````
With dotenv and using node command line to set requires

```bash
node --require dotenv/config --require @opentelemetry/auto-instrumentations-node/register server.js
```

### Without dotenv

Without dotenv and using an environment variable to set config and requires

```bash
export OTEL_SERVICE_NAME="<dataset namespace name>"
export OTEL_EXPORTER_OTLP_ENDPOINT="https://sdk.playerzero.app/otlp"
export OTEL_EXPORTER_OTLP_HEADERS="Authorization=Bearer <your PlayerZero ingest token>"
export OTEL_EXPORTER_OTLP_PROTOCOL="http/protobuf"
export OTEL_TRACES_EXPORTER="otlp"
export OTEL_METRICS_EXPORTER="otlp"
export OTEL_LOGS_EXPORTER="otlp"
export OTEL_NODE_RESOURCE_DETECTORS="env,host,process"
export OTEL_NODE_DISABLED_INSTRUMENTATIONS="fs"
export NODE_OPTIONS="--require @opentelemetry/auto-instrumentations-node/register"
node server.js
```
Without dotenv and using node command line to set requires

```bash
export OTEL_SERVICE_NAME="<dataset namespace name>"
export OTEL_EXPORTER_OTLP_ENDPOINT="https://sdk.playerzero.app/otlp"
export OTEL_EXPORTER_OTLP_HEADERS="Authorization=Bearer <your PlayerZero ingest token>"
export OTEL_EXPORTER_OTLP_PROTOCOL="http/protobuf"
export OTEL_TRACES_EXPORTER="otlp"
export OTEL_METRICS_EXPORTER="otlp"
export OTEL_LOGS_EXPORTER="otlp"
export OTEL_NODE_RESOURCE_DETECTORS="env,host,process"
node --require @opentelemetry/auto-instrumentations-node/register server.js
```

Be sure to replace the <your PlayerZero ingest token with your token, and the
dataset namespace name with the name of the application you are instrumenting.

In order to get logging sent to PlayerZero, you'll have to add the @opentelemetry/exporter-logs-otlp-proto
package and use something like the following as the pino transport:

``` javascript
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
```

### Author

Brad Morris

https://www.playerzero.ai/

### Version

1.0.0

### License

This project is licensed under the MIT License

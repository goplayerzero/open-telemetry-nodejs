# open-telemetry-nodejs
Demonstration of Open Telemetry Instrumentation with NodeJs

## Quick Start

``` bash
# Install dependencies for client and server
cd client && npm install
cd server-winston && npm install
```
Edit .env configuration and client/public/index.html to add your playerzero token

```bash
# Run the Express server
npm run start-winston
````
Server runs on http://localhost:5000
Client runs on http://localhost:3000

## Details

This repo includes samples of a very simple react frontend (client) and backends 
using the Winston logger (server-winston) and the Pino logger (server-pino).

In order to integrate your back end with PlayerZero, follow these steps:

1. Add OpenTelemetry libraries:
```shell
npm install --save @opentelemetry/api @opentelemetry/api-logs @opentelemetry/auto-instrumentations-node @opentelemetry/exporter-logs-otlp-proto @opentelemetry/exporter-trace-otlp-proto @opentelemetry/resources @opentelemetry/sdk-logs
```

2. Add logger specific libraries:

For winston:
```shell
npm install --save @opentelemetry/winston-transport
```

For pino:
```shell
npm install --save pino-opentelemetry-transport
```

3. Change your logger to add OpenTelemetry

For winston, add:

```javascript
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
```

For pino, add a transport with a target pino-opentelemetry-transport like this
(note this needs to be added to existing pino config if available):

```javascript
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
    level: 'info',
    timestamp: true
  },
  transport
)
```

4. Configure environment variables (these can be injected using your preferred way of handling 
env variables). Note you should replace <Your process name here> with the 
name of this process, like app-backend and the <Your PlayerZero ingest 
token> with your PlayerZero ingest token which can be found at 
https://go.playerzero.app/setting/web.  Note that we have disabled the fs instrumentation due to performance 
overhead.  And for OTEL_NODE_RESOURCE_DETECTORS variables, allowed values include: env, host, os, process, 
serviceinstance, container, alibaba, aws, azure, gcp, as well as all and none.  See 
https://www.npmjs.com/package/@opentelemetry/auto-instrumentations-node for 
documentation:

```shell
export OTEL_SERVICE_NAME="<Your process name here>"
export OTEL_EXPORTER_OTLP_ENDPOINT="https://sdk.playerzero.app/otlp"
export OTEL_EXPORTER_OTLP_HEADERS="Authorization=Bearer <Your PlayerZero ingest token>"
export OTEL_EXPORTER_OTLP_PROTOCOL="http/protobuf"
export OTEL_TRACES_EXPORTER="otlp"
export OTEL_METRICS_EXPORTER="otlp"
export OTEL_LOGS_EXPORTER="otlp"
export OTEL_NODE_RESOURCE_DETECTORS="env,host,process"
export OTEL_NODE_DISABLED_INSTRUMENTATIONS="fs"
```

5. Require auto-instrumentation at node startup

Due to the way open telemetry works, it must be loaded when node loads, not afterward.  
You can do this by setting an environment variable before the node process starts
or in a system like K8s:

```shell
export NODE_OPTIONS="--require @opentelemetry/auto-instrumentations-node/register"
```

Or passing the require on the node command line:

```shell
node --require @opentelemetry/auto-instrumentations-node/register index.js
```
Or configuring your package.json to pass the require on start:

```json
"scripts": {
    "start": "node --require @opentelemetry/auto-instrumentations-node/register server.js",
  },
```

Finally, if you are using dotenv to manage configuration variables in step 4, you'll
have to require that before you require auto-instrumentation.

In the above examples, put -require dotenv/config  before
--require @opentelemetry/auto-instrumentations-node/register

```shell
export NODE_OPTIONS="--require dotenv/config --require @opentelemetry/auto-instrumentations-node/register"
```


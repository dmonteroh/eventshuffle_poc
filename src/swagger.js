const swaggerAutogen = require('swagger-autogen')()

const outputFile = '../src/swagger_output.json'
const endpointsFiles = ['../src/index.ts']

swaggerAutogen(outputFile, endpointsFiles)
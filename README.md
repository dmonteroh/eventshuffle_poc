# eventshuffle_poc

The Event Shuffle service has been made using TypeScript NodeJS with Express and MongoDB.

The main deployment method is to use docker-compose, however, it can be run as a standard docker image, or directly from the folder.

The default environment variables are set for docker-compose use. Please replace the default value (mongo) of MONGO_URI for 127.0.0.1 if not using docker-compose. The service will then be accesible through **localhost:8080** by default.

## Installation of Docker, Docker-Compose
Since the installation depends on the OS, the recommended way to install Docker can be found in their website: https://docs.docker.com/get-docker/

Similarly, Docker offers documentation for the installation of Docker Compose: https://docker-docs.netlify.app/compose/install/

## Docker Compose
```
docker-compose up -d
```

The docker-compose has MongoDB pre-configured, and the system points automatically to the docker instance of "mongo" for a connection.

## Docker Image

Unless we create a link between this image and the MongoDB image, remember to change the environment variable of MONGO_URI.

```
docker build . -t dmonteroh/eventshuffle_poc
docker run dmonteroh/eventshuffle_poc -d
```

## Manual Deployment & Scripts

The service has 4 scripts:

 - test == Run vitest tests
 - lint == Run eslint tests
 - build == Compiles the code
 - start == Compile and run
 - start:dev == Run using nodemon with filewatch and auto-restart

For running the service without docker, use the npm run command followed by any of the above mentioned scripts. For example:

```
npm run start:dev 
```

## Postman, REST Clients & Swagger
Import the EventShuffle Env and EventShuffle collection in your preferred REST Client, this includes the following endpoints:

 - /api/v1/event/list [GET]: Returns list of events
 - /api/v1/event/:id [GET]: Returns details of specified event
 - /api/v1/event/:id/results [GET]: Returns the best date(s) based on votes
 - /api/v1/event [POST]: Creates a new event
 - /api/v1/event/:id/vote [POST]: Cast a vote to specified event

 An automatically created swagger for the service can be found in http://localhost:8080/doc. I have not updated the contents of the file, it only auto-generates the endpoints at this time.
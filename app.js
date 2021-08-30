require('dotenv/config');
const express = require('express');
const middlewares = require('./src/middleware');
const app = express();
const glob = require('glob');
require('./src/config/db');

// custom logger 
const appLogger = require('./src/utils/logger');
global.__basedir = __dirname;
app.use(appLogger.requestDetails(appLogger));

// const authenticate = require('./utils/authenticate');
app.enable('trust proxy');
middlewares(app);

/* Router setup */
// onboard apis 
const onBoardOpenRouter = express.Router(); // Open routes
const onBoardApiRouter = express.Router(); // Protected routes

// contract apis 
const contractOpenRouter = express.Router(); // Open routes
const contractApiRouter = express.Router(); // Protected routes


/* Fetch router files and apply them to our routers */
glob('./src/components/onBoard/*', null, (err, items) => {
  items.forEach(component => {
    if (require(component).routes) require(component).routes(
      onBoardOpenRouter,
      onBoardApiRouter,
    );
  });
});

glob('./src/components/contract/*', null, (err, items) => {
  items.forEach(component => {
    if (require(component).routes) require(component).routes(
      contractOpenRouter,
      contractApiRouter,
    );
  });
});

// User Routes
app.use('/v1/user', onBoardOpenRouter);
app.use('/api/v1/user', onBoardApiRouter);

// Contract Routes 
app.use('/v1/contracts', contractOpenRouter);
app.use('/api/v1/contracts', contractApiRouter);

// exporting the app
module.exports = app;

const express = require('express');
const helmet = require('helmet');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helpers = require('./helpers');
const coreAuthRouter = require('./routes/coreRoutes/coreAuth');
const coreApiRouter = require('./routes/coreRoutes/coreApi');
const coreDownloadRouter = require('./routes/coreRoutes/coreDownloadRouter');
const corePublicRouter = require('./routes/coreRoutes/corePublicRouter');
const errorHandlers = require('./handlers/errorHandlers');
const erpApiRouter = require('./routes/appRoutes/appApi');
const bulkData = require('./routes/bulkRoutes/bulkRoutes');
const remarkHistory = require('./routes/notificationRouter');
const authenticate = require('./middlewares/authenticate');
const checkUserRoleMiddleware = require('@/middlewares/checkUserRole');

const app = express();
const corsOptions = {
  origin: true,
  credentials: true,
};
app.use(cors(corsOptions));

app.get('/', function (req, res) {
  res.status(200).send('👍👍This Project is live and Working fine with use websocket🚀🚀🚀🚀');
});

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// pass variables to our templates + all requests

app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.admin = req.admin || null;
  res.locals.currentPath = req.path;
  next();
});

// Here our API Routes
app.use('/api', coreAuthRouter);
app.use('/api',authenticate,checkUserRoleMiddleware, coreApiRouter);
app.use('/api',authenticate,checkUserRoleMiddleware, erpApiRouter);
app.use('/download', coreDownloadRouter);
app.use('/public', corePublicRouter);
app.use('/api', bulkData);
app.use('/api', remarkHistory);
app.use('/api', require("@/routes/teamApi/teamRoutes"))
// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

// done! we export it so we can start the site in start.js
module.exports = app;

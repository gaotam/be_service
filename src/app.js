const path = require('path');
const { createServer } = require("http");
const { Server } = require("socket.io");
const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const config = require('./config/config');
const morgan = require('./config/morgan');
const ApiError = require('./utils/ApiError');
const httpStatus = require('http-status');
const socketServices = require("./services/socket.service")
const { userRoute, adminRoute } = require("./routes");
const { errorConverter, errorHandler, a } = require('./middlewares/error');
const { protectSocket } = require('./middlewares/auth');

const app = express();
const httpServer = createServer(app)
const io = new Server(httpServer, { 
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: "websocket"
});

global._io = io;

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
// app.use(
//   helmet({
//     contentSecurityPolicy: false,
//   })
// );

// parse cookie
app.use(cookieParser('hoang'));

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// parse json request body
app.use(express.json());

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

app.use("/static", express.static(path.join(__dirname, "../../uploads")));

console.log(path.join(__dirname, "../uploads"));
// v1 api routes
app.use("/api/admin/v1", adminRoute)
app.use("/api/v1", userRoute);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

_io.use(protectSocket)
_io.on('connection', socketServices.connection)

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = httpServer;

const express = require('express');
const router = express.Router();
const authRouter = require('./auth.route');
const userRouter = require('./user.route');
const notificationRouter = require('./notification.route');
const { protect, authorize } = require("../../middlewares/auth")

const defaultRoutes = [
  {
    path: '/auth',
    route: authRouter,
  },
  {
    path: "/users",
    route: userRouter
  },{
    path: "/",
    route: notificationRouter
  }
];

const protectRoutes = [
  
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

protectRoutes.forEach((route) => {
  router.use(route.path, protect, route.route);
});

module.exports = router
const express = require('express');
const router = express.Router();
const authRouter = require('./auth.route');
const userRouter = require('./user.route');
const categoryRouter = require('./category.route');
const videoRouter = require('./video.route');
const liveRouter = require('./live.route');
const commentRouter = require('./comment.route');
const historyRouter = require('./history.route');
const subscriptionRouter = require("./subscription.route")
const notificationRouter = require("./notification.route")

const { protect, authorize } = require("../../middlewares/auth")

const defaultRoutes = [
  {
    path: '/auth',
    route: authRouter,
  },
  {
    path: "/categories",
    route: categoryRouter
  },
  {
    path: "/live",
    route: liveRouter
  },
  {
    path: "/videos",
    route: videoRouter
  },
  {
    path: "/comments",
    route: commentRouter
  },
  {
    path: "/users",
    route: userRouter
  },
];

const protectRoutes = [
  {
    path: "/history",
    route: historyRouter
  },
  {
    path: "/subscriptions",
    route: subscriptionRouter
  },
  {
    path: "/notifications",
    route: notificationRouter
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

protectRoutes.forEach((route) => {
  router.use(route.path, protect, route.route);
});

module.exports = router
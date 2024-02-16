const express = require('express');
const router = express.Router();
const authRouter = require('./auth.route');
const userRouter = require('./user.route');
const categoryRouter = require('./category.route');
const videoRouter = require('./video.route');
const liveRouter = require('./live.route');
const commentRouter = require('./comment.route');

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
    path: "/users",
    route: userRouter
  },
  {
    path: "/videos",
    route: videoRouter
  },
  {
    path: "/live",
    route: liveRouter
  }
];

const protectRoutes = [
  {
    path: "/comments",
    route: commentRouter
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

protectRoutes.forEach((route) => {
  router.use(route.path, protect, route.route);
});

module.exports = router
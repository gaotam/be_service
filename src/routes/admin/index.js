const express = require('express');
const router = express.Router();
const userRouter = require('./user.route');
const authRouter = require('./auth.route');
const { protect, authorize } = require("../../middlewares/auth")

const secretRoutes = [
  {
    path: "/auth",
    route: authRouter
  }
]

const adminRoutes = [
  {
    path: "/users",
    route: userRouter
  }
];

secretRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

adminRoutes.forEach((route) => {
  router.use(route.path, protect, authorize('ADMIN'), route.route);
});

module.exports = router
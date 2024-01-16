const express = require('express');
const router = express.Router();
const userRouter = require('./user.route');
const authRouter = require('./auth.route');
const categoryRouter = require('./category.route');

const { protect, authorize } = require("../../middlewares/auth")

const adminRoutes = [
  {
    path: "/users",
    route: userRouter
  },
  {
    path: "/categories",
    route: categoryRouter
  }
];

adminRoutes.forEach((route) => {
  router.use(route.path, protect, authorize('ADMIN'), route.route);
});

module.exports = router
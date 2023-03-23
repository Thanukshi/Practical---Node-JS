const routes = require("express").Router();

const UserRoutes = require("./UserRouters");
const AdminRoutes = require("./AdminRouters");

routes.use("/user", UserRoutes);
routes.use("/admin", AdminRoutes);

module.exports = routes;

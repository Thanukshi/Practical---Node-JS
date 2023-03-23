const routes = require("express").Router();

var AdminController = require("../../Controllers/AdminController");

routes.post("/admin_login", AdminController.AdminLogin);
routes.put("/update/:id", AdminController.UpdateUserStatus);
routes.get("/get_approved_list", AdminController.GetAllApprovedUsrList);

module.exports = routes;

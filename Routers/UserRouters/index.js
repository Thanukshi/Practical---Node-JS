const routes = require("express").Router();

var UserController = require("../../Controllers/UserController");
const upload = require("../../FileUploading/multer");
const utils = require("../../Utils/utils");

routes.post("/register", upload.single("image"), UserController.AddUser);
routes.post("/login", UserController.UserLogin);

routes.put("/update_password", UserController.SetUserPassword);
routes.put(
  "/update",
  upload.single("image"),
  utils.authMiddleware,
  UserController.UpdateUserDeails
);

routes.delete("/delete", utils.authMiddleware, UserController.DeleteUser);

module.exports = routes;

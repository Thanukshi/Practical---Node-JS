const Users = require("../Models/UserModel");
const Admin = require("../Models/AdminModel");
const globalMessage = require("../Errors/error.messages");
const sendEmail = require("../Mails/sendEmail");

exports.AdminLogin = async function (req, res) {
  const NewAdmin = new Admin({
    Email: req.body.Email,
    Password: req.body.Password,
  });
  console.log("admin", NewAdmin);
  try {
    if (!req.body.Email) {
      return res.status(406).json({
        code: globalMessage.NotAcceptable,
        status: globalMessage.NotSuccess,
        message: `Email cannot be empty.`,
      });
    } else if (!req.body.Password) {
      return res.status(406).json({
        code: globalMessage.NotAcceptable,
        status: globalMessage.NotSuccess,
        message: `Password cannot be empty.`,
      });
    } else {
      Admin.loginAdmin(req.body.Email, req.body.Password, (err, admin_data) => {
        return res.status(201).json({
          code: globalMessage.OKCode,
          status: globalMessage.Success,
          message: "Login Successfully",
          UserData: admin_data,
        });
      });
    }
  } catch (error) {
    return res.status(500).json({
      code: globalMessage.InternalServerErrorCode,
      status: globalMessage.NotSuccess,
      message: error,
    });
  }
};

exports.UpdateUserStatus = async function (req, res) {
  const UpdateUser = new Users({
    Status: 1,
  });
  try {
    Users.updateById(req.params.id, UpdateUser, (err, user_data) => {
      if (!err) {
        Users.findById(req.params.id, async (err, data) => {
          console.log("ddd", data[0]);
          const email = data[0].Email;
          await sendEmail(
            email,
            "Account Activated",
            "Your account has been activated. Now you can update your password and login."
          );
        });
        return res.status(200).json({
          code: globalMessage.OKCode,
          status: globalMessage.Success,
          message: "User Updated Successfully",
          UserData: user_data,
        });
      } else {
        return res.status(400).json({
          code: globalMessage.BadCode,
          status: globalMessage.NotSuccess,
          message: err,
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      code: globalMessage.InternalServerErrorCode,
      status: globalMessage.NotSuccess,
      message: error,
    });
  }
};

exports.GetAllApprovedUsrList = async function (req, res) {
  try {
    Users.getAllaprovedUserList((err, user_data) => {
      if (!user_data && !user_data.length) {
        return res.status(500).json({
          code: globalMessage.InternalServerErrorCode,
          status: globalMessage.NotSuccess,
          message: "User List is not fount",
        });
      } else {
        return res.status(201).json({
          code: globalMessage.OKCode,
          status: globalMessage.Success,
          message: "User Approved list loaded",
          UserData: user_data,
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      code: globalMessage.InternalServerErrorCode,
      status: globalMessage.NotSuccess,
      message: error,
    });
  }
};

const Users = require("../Models/UserModel");
const globalMessage = require("../Errors/error.messages");
const utils = require("../Utils/utils");
const cloudinary = require("../FileUploading/cloudinary");

exports.AddUser = async function (req, res) {
  try {
    if (!req.body.First_Name) {
      return res.status(406).json({
        code: globalMessage.NotAcceptable,
        status: globalMessage.NotSuccess,
        message: `First Name cannot be empty.`,
      });
    } else if (!req.body.Last_Name) {
      return res.status(406).json({
        code: globalMessage.NotAcceptable,
        status: globalMessage.NotSuccess,
        message: `Last Name cannot be empty.`,
      });
    } else if (!req.body.Email) {
      return res.status(406).json({
        code: globalMessage.NotAcceptable,
        status: globalMessage.NotSuccess,
        message: `Email cannot be empty.`,
      });
    } else if (!req.body.Phone_Number) {
      return res.status(406).json({
        code: globalMessage.NotAcceptable,
        status: globalMessage.NotSuccess,
        message: `Phone Number cannot be empty.`,
      });
    } else {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "Profile",
      });

      const newUser = new Users({
        First_Name: req.body.First_Name,
        Last_Name: req.body.Last_Name,
        Email: req.body.Email,
        Profile_Picture: result.secure_url,
        Phone_Number: req.body.Phone_Number,
        Status: 0,
      });

      Users.findByFirstNameAndLastName(
        req.body.First_Name,
        req.body.Last_Name,
        (err, data) => {
          if (data && data.length) {
            return res.status(400).json({
              code: globalMessage.BadCode,
              status: globalMessage.NotSuccess,
              message: `This ${req.body.First_Name} ${req.body.Last_Name} is already exist.`,
            });
          } else {
            Users.findByEmail(req.body.Email, (err, data) => {
              if (data && data.length) {
                return res.status(400).json({
                  code: globalMessage.BadCode,
                  status: globalMessage.NotSuccess,
                  message: `This ${req.body.Email} is already exist.`,
                });
              } else {
                Users.findByPhone_Number(req.body.Phone_Number, (err, data) => {
                  if (data && data.length) {
                    return res.status(400).json({
                      code: globalMessage.BadCode,
                      status: globalMessage.NotSuccess,
                      message: `This ${req.body.Phone_Number} is already exist.`,
                    });
                  } else {
                    Users.registerUser(newUser, (err, user_data) => {
                      if (err) {
                        return res.status(400).json({
                          code: globalMessage.BadCode,
                          status: globalMessage.NotSuccess,
                          message: err,
                        });
                      } else {
                        return res.status(201).json({
                          code: globalMessage.CreatedCode,
                          status: globalMessage.Success,
                          message: globalMessage.CreateSuccessMessage,
                          UserData: user_data,
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        }
      );
    }
  } catch (error) {
    return res.status(500).json({
      code: globalMessage.InternalServerErrorCode,
      status: globalMessage.NotSuccess,
      message: error,
    });
  }
};

exports.SetUserPassword = async function (req, res) {
  const saltHash = utils.genPassword(req.body.Password);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const updateUserPassword = new Users({
    hash: hash,
    salt: salt,
  });

  try {
    Users.findByEmail(req.body.Email, (err, data) => {
      if (data && data.length) {
        Users.updateUserPassword(
          req.body.Email,
          updateUserPassword,
          (err, user_data) => {
            if (!user_data) {
              return res.status(406).json({
                code: globalMessage.NotAcceptable,
                status: globalMessage.NotSuccess,
                message: `You are not an approved user`,
              });
            } else {
              return res.status(201).json({
                code: globalMessage.OKCode,
                status: globalMessage.Success,
                message: "User Password Updated Successfully",
                UserData: user_data,
              });
            }
          }
        );
      } else {
        return res.status(400).json({
          code: globalMessage.BadCode,
          status: globalMessage.NotSuccess,
          message: `This ${req.body.Email} does not exist.`,
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

exports.UserLogin = async function (req, res) {
  try {
    Users.findByEmail(req.body.Email, (err, user_data) => {
      if (!user_data) {
        return res.status(400).json({
          code: globalMessage.BadCode,
          status: globalMessage.NotSuccess,
          message: `This ${req.body.Email} does not exist.`,
        });
      } else {
        const isValid = utils.validPassword(
          req.body.Password,
          user_data[0].hash,
          user_data[0].salt
        );

        if (isValid) {
          const token = utils.issueJWT(user_data[0]);

          return res.status(200).json({
            code: globalMessage.OKCode,
            status: globalMessage.Success,
            message: "Login is successfuly.",
            UserData: user_data,
            Token: token,
            expiresIn: token.expires,
            sub: token.sub,
          });
        } else {
          return res.status(400).json({
            code: globalMessage.BadCode,
            status: globalMessage.NotSuccess,
            message: `Your Password is wrong. Please try again with correct password.`,
          });
        }
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

exports.UpdateUserDeails = async function (req, res) {
  try {
    if (!req.body.First_Name) {
      return res.status(406).json({
        code: globalMessage.NotAcceptable,
        status: globalMessage.NotSuccess,
        message: `First Name cannot be empty.`,
      });
    } else if (!req.body.Last_Name) {
      return res.status(406).json({
        code: globalMessage.NotAcceptable,
        status: globalMessage.NotSuccess,
        message: `Last Name cannot be empty.`,
      });
    } else if (!req.body.Email) {
      return res.status(406).json({
        code: globalMessage.NotAcceptable,
        status: globalMessage.NotSuccess,
        message: `Email cannot be empty.`,
      });
    } else if (!req.body.Phone_Number) {
      return res.status(406).json({
        code: globalMessage.NotAcceptable,
        status: globalMessage.NotSuccess,
        message: `Phone Number cannot be empty.`,
      });
    } else {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "Profile",
      });

      const UpdateUser = new Users({
        First_Name: req.body.First_Name,
        Last_Name: req.body.Last_Name,
        Email: req.body.Email,
        Phone_Number: req.body.Phone_Number,
        Profile_Picture: result.secure_url,
      });

      Users.updateUserDetails(
        req.jwt.sub.id,
        UpdateUser,
        async (err, user_data) => {
          if (!err) {
            return res.status(201).json({
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
        }
      );
    }
  } catch (error) {
    return res.status(500).json({
      code: globalMessage.InternalServerErrorCode,
      status: globalMessage.NotSuccess,
      message: error,
    });
  }
};

exports.DeleteUser = async function (req, res) {
  try {
    Users.deleteUser(req.jwt.sub.id, (err, user_data) => {
      return res.status(200).json({
        code: globalMessage.OKCode,
        status: globalMessage.Success,
        message: "User Deleted Successfully",
      });
    });
  } catch (error) {
    return res.status(500).json({
      code: globalMessage.InternalServerErrorCode,
      status: globalMessage.NotSuccess,
      message: error,
    });
  }
};

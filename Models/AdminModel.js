const sql = require("./db.setup");

const Admin = function (data) {
  this.Email = data.Email;
  this.Password = data.Password;
};

Admin.loginAdmin = (Email, Password, result) => {
  sql.query(
    `SELECT * FROM admin WHERE Email ='${Email}' AND Password = '${Password}' `,
    (err, res) => {
      if (err) {
        console.log("err", err);
        result("", err);
        return;
      }

      if (res) {
        console.log("first", res);
        result("Admin found", res);
        return;
      }
      // not found post with the id
      result("Recived Not Success");
    }
  );
};

module.exports = Admin;

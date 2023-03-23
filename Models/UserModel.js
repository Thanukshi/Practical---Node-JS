const sql = require("./db.setup");

const Users = function (data) {
  this.First_Name = data.First_Name;
  this.Last_Name = data.Last_Name;
  this.Email = data.Email;
  this.Profile_Picture = data.Profile_Picture;
  this.Phone_Number = data.Phone_Number;
  this.Status = data.Status;
  this.hash = data.hash;
  this.salt = data.salt;
};

Users.registerUser = (newUser, result) => {
  sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err.message, "");
      return;
    }

    console.log("new user aded success. ", {
      id: res.insertId,
      ...newUser,
    });
    result("", { id: res.insertId, ...newUser });
  });
};

Users.findByFirstNameAndLastName = (First_Name, Last_Name, result) => {
  sql.query(
    `SELECT * FROM users WHERE First_Name ='${First_Name}' AND Last_Name = '${Last_Name}' `,
    (err, res) => {
      if (err) {
        result("", err.message);
        return;
      }

      if (res) {
        result("First name and Last name found", res);
        return;
      }
      // not found post with the id
      result("Recived Not Success");
    }
  );
};

Users.findByEmail = (Email, result) => {
  sql.query(`SELECT * FROM users WHERE Email ='${Email}' `, (err, res) => {
    if (err) {
      result("", err.message);
      return;
    }

    if (res) {
      result("Email found", res);
      return;
    }
    console.log("rrr", res);
    result("Recived Not Success");
  });
};

Users.findByPhone_Number = (Phone_Number, result) => {
  sql.query(
    `SELECT * FROM users WHERE Phone_Number ='${Phone_Number}' `,
    (err, res) => {
      if (err) {
        result("", err.message);
        return;
      }

      if (res) {
        result("Phone Number found", res);
        return;
      }
      // not found post with the id
      result("Recived Not Success");
    }
  );
};

Users.findById = (id, result) => {
  sql.query(`SELECT * FROM users WHERE id ='${id}' `, (err, res) => {
    if (err) {
      result("", err.message);
      return;
    }

    if (res) {
      result("First name found", res);
      return;
    }
    // not found post with the id
    result("Recived Not Success");
  });
};

Users.updateById = (id, UpdateUser, result) => {
  sql.query(
    `UPDATE users SET Status='${UpdateUser.Status}' WHERE id='${id}'`,
    (err, res) => {
      if (err) {
        result("", err.message);
        return;
      }

      if (res.affectedRows == 0) {
        result("User not found");
        return;
      }

      console.log("updated user: ", { id: id, ...UpdateUser });
      result("", { id: id, ...UpdateUser });
    }
  );
};

Users.updateUserPassword = (Email, updateUserPassword, result) => {
  sql.query(
    `UPDATE users SET hash='${updateUserPassword.hash}', salt='${updateUserPassword.salt}' WHERE Email='${Email}' AND Status = 1`,
    (err, res) => {
      if (err) {
        console.log(err);
        result("", err.message);
        return;
      }

      if (res.affectedRows == 0) {
        result("user not found");
        return;
      }

      console.log("updated user: ", { Email: Email, ...updateUserPassword });
      result("", { Email: Email, ...updateUserPassword });
    }
  );
};

Users.getAllaprovedUserList = (result) => {
  sql.query(`Select * From users WHERE Status= 0`, (err, res) => {
    if (err) {
      result("", err.message);
      return;
    }

    if (res) {
      result("First name found", res);
      return;
    }
    result("Recived Not Success");
  });
};

Users.updateUserDetails = (id, UpdateUser, result) => {
  sql.query(
    `UPDATE users SET First_Name='${UpdateUser.First_Name}', Last_Name='${UpdateUser.Last_Name}', Email='${UpdateUser.Email}', 
    Phone_Number='${UpdateUser.Phone_Number}', Profile_Picture='${UpdateUser.Profile_Picture}' WHERE id='${id}'`,
    (err, res) => {
      if (err) {
        result("", err.message);
        return;
      }

      if (res.affectedRows == 0) {
        result("User not found");
        return;
      }

      result("", { id: id, ...UpdateUser });
    }
  );
};

Users.deleteUser = (id, result) => {
  sql.query(`DELETE FROM users WHERE id='${id}'`, (err, res) => {
    console.log("id", id);
    if (err) {
      result("", err.message);
      return;
    }

    if (res) {
      result("Deleted Successfully", res);
      return;
    } else {
      result("Deleted Not Success");
    }
  });
};
module.exports = Users;

const crypto = require("crypto");
const jsonwebtoken = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { use } = require("../Routers");

const pathToKey = path.join(__dirname, "..", "id_rsa_priv.pem");
const pathToPubKey = path.join(__dirname, "..", "id_rsa_pub.pem");
const PRIV_KEY = fs.readFileSync(pathToKey, "utf8");
const PUB_KEY = fs.readFileSync(pathToPubKey, "utf8");

/**
 *
 * @param {*} password - The plain text password
 * @param {*} hash - The hash stored in the database
 * @param {*} salt - The salt stored in the database
 *
 * This function uses the crypto library to decrypt the hash using the salt and then compares
 * the decrypted hash/salt with the password that the user provided at login
 */
function validPassword(password, hash, salt) {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash === hashVerify;
}

/**
 *
 * @param {*} password - The password string that the user inputs to the password field in the register form
 *
 * This function takes a plain text password and creates a salt and hash out of it.  Instead of storing the plaintext
 * password in the database, the salt and hash are stored for security
 *
 * ALTERNATIVE: It would also be acceptable to just use a hashing algorithm to make a hash of the plain text password.
 * You would then store the hashed password in the database and then re-hash it to verify later (similar to what we do here)
 */
function genPassword(password) {
  var salt = crypto.randomBytes(32).toString("hex");
  var genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return {
    salt: salt,
    hash: genHash,
  };
}

/**
 * @param {*} user - The user object.  We need this to set the JWT `sub` payload property to the MongoDB user ID
 */
function issueJWT(user) {
  const expiresIn = "2w";

  const payload = {
    sub: {
      id: user.id,
      First_Name: user.First_Name,
      Last_Name: user.Last_Name,
      Email: user.Email,
      Profile_Picture: user.Profile_Picture,
      Phone_Number: user.Phone_Number,
      Status: user.Status,
    },
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
    expiresIn: expiresIn,
    algorithm: "RS256",
  });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
    sub: {
      id: user.id,
      First_Name: user.First_Name,
      Last_Name: user.Last_Name,
      Email: user.Email,
      Profile_Picture: user.Profile_Picture,
      Phone_Number: user.Phone_Number,
      Status: user.Status,
    },
  };
}

function authMiddleware(req, res, next) {
  if (req.headers.authorization) {
    const tokenParts = req.headers.authorization.split(" ");
    if (
      tokenParts[0] === "Bearer" &&
      tokenParts[1].match(/\S+\.\S+\.\S+/) !== null
    ) {
      try {
        const verification = jsonwebtoken.verify(tokenParts[1], PUB_KEY, {
          algorithms: ["RS256"],
        });
        req.jwt = verification;
        next();
      } catch (err) {
        res.status(401).json({
          success: false,
          status: "Unauthorized",
          msg: "You are not authorized to visit this route catch",
        });
      }
    } else {
      res.status(401).json({
        success: false,
        status: "Unauthorized",
        msg: "You are not authorized to visit this route",
      });
    }
  } else {
    res.status(401).json({
      success: false,
      status: "TokenError",
      msg: "You are not authorized to visit this route",
    });
  }
}

function decodeToken(token) {
  var authorization = token.split(" ")[1];
  var decodedVal = jsonwebtoken.verify(authorization, PUB_KEY, {
    algorithms: ["RS256"],
  });
  console.log("decodedVal", decodedVal);
  return decodedVal;
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
module.exports.issueJWT = issueJWT;
module.exports.authMiddleware = authMiddleware;
module.exports.decodeToken = decodeToken;

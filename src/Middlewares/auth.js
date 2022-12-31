const jwt = require("jsonwebtoken");
require("dotenv").config();

//ma hoa du lieu
const encodeTokenEmail = (data) => {
  let token = jwt.sign(data, process.env.ENDCODE_EMAIL, {
    expiresIn: "1h",
  });
  return token;
};

//check token hop le
const compareToken = (token) => {
  const veryfyToken = jwt.verify(token, process.env.ENDCODE_EMAIL);
  if (veryfyToken) {
    return veryfyToken;
  } else {
    return false;
  }
};
//giãi mã
const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = { encodeTokenEmail, compareToken, decodeToken };

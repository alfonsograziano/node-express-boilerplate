let jwt = require('jsonwebtoken');
require("dotenv").config(); 

let checkToken = (req, res, next) => {
  let token = req.headers['authorization']; // Express headers are auto converted to lowercase
  //console.log("Token:" + token)
  if(typeof token === "undefined"){
    return res.status(403).json({
      success: false,
      message: 'Token is not defined'
    });
  }

  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    if(token === process.env.ADMIN_AUTH){
      //console.log("Benvenuto Admin... procedo a servire la tua richiesta!");
      req.decoded = {}
      req.decoded.user = "admin"
      req.token = token
      next();
    }else{
      jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).json({
            success: false,
            message: 'Token is not valid'
          });
        } else {
          req.token = token
          req.decoded = decoded;
          next();
        }
      });
    }
    
  } else {
    return res.json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
};

module.exports = {
  checkToken: checkToken
}
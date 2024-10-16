const jwt = require('jsonwebtoken');

const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization
   console.log("authheader is :,",authHeader);
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({msg: "Unauthorized. Please add valid token....."});
  }

  const token = authHeader.split(' ')[1]
//  console.log("token is :,",token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
   console.log("user is",decoded);
    
    const { id, name } = decoded
    // console.log("this is ",{id,name})
        req.user = { id, name }
   //  console.log("user is",req.user);
     next()
  } catch (error) {
    console.log("me delete ......");
    return res.status(401).json({msg: "Unauthorized. Please add validhhh token"});
  }
}

module.exports = authenticationMiddleware
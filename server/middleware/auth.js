const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // console.log(req)

  // console.log(token)
  // console.log(req.header)

  // Check if not token
  if(!token) {
		return res.status(401).json({ errors:[{ msg: '请先完成登录！ '}] })      // @yuchen 我觉得这样的逻辑稍好一点
  }

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    req.user = decoded.user.id;
    req.title = decoded.user.title;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}
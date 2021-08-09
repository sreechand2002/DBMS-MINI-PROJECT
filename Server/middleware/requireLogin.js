const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('user');
const { JWT_KEY } = require('../config/keys');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'you must be logged in L10' });
  }
  const token = authorization.replace('Bearer ', '');
  jwt.verify(token, JWT_KEY, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: err + ' you must be logged in L15' });
    }

    const { _id } = payload;
    User.findById(_id).then((userdata) => {
      req.user = userdata;
      next();
    });
  });
};

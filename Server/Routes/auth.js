const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = mongoose.model('user');
const jwt = require('jsonwebtoken');
const { JWT_KEY } = require('../config/keys');
const { EMAIL } = require('../config/keys');
const requi = require('../middleware/requireLogin');

const nodemailer = require('nodemailer');
const sendgridtransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(
  sendgridtransport({
    auth: {
      api_key: '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'
    }
  })
);

router.get('/', (req, res) => {
  res.send('The auth API is working');
});

router.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ error: 'fill in all the fields' });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (savedUser) {
      return res.status(422).json({ error: 'email already exists' });
    }

    bcrypt.hash(password, 12).then((hashedpassword) => {
      const user = new User({
        email,
        password: hashedpassword,
        name
      });

      user
        .save()
        .then((user) => {
          transporter.sendMail({
            to: user.email,
            from: 'sreechand2002@gmail.com',
            subject: 'Thanks for singing up',
            html: '<h1>Welcome to post it</h1>'
          });
          res.json({ message: 'saved to db' });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
});

router.post('/signin', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: 'please enter the email or password' });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: 'invalid email or password' });
    }
    bcrypt.compare(password, savedUser.password).then((pass) => {
      if (pass) {
        const token = jwt.sign({ _id: savedUser._id }, JWT_KEY);
        const { _id, name, email, followers, following } = savedUser;
        res.json({ token: token, user: { _id, name, email, followers, following } });
      } else {
        res.status(422).json({ error: 'Invalid password' });
      }
    });
  });
});

router.get('/dashboard', requi, (req, res) => {
  res.send('welcome');
});

router.post('/reset-password', (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res.status(422).json({ error: 'User dont exists with that email' });
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;
      user.save().then((result) => {
        transporter.sendMail({
          to: user.email,
          from: 'sreechand2002@gmail.com',
          subject: 'password reset',
          html: `
                  <p>You requested for password reset</p>
                  <h5>click in this <a href="${EMAIL}/reset/${token}">link</a> to reset password</h5>
                  `
        });
        res.json({ message: 'check your email' });
      });
    });
  });
});

router.post('/new-password', (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res.status(422).json({ error: 'Try again session expired' });
      }
      bcrypt.hash(newPassword, 12).then((hashedpassword) => {
        user.password = hashedpassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then((saveduser) => {
          res.json({ message: 'password updated success' });
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;

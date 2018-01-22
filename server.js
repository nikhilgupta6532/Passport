var express = require('express');
var http = require('http');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const cookieSession = require('cookie-session');

var app = express();

var server = http.createServer(app);

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: ['dsfsdfadfdg']
  })
);

app.use(passport.initialize());
app.use(passport.session());

require('./passport/passport');

app.post('/auth', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err || !user) {
      console.log('Error', info);
    }
    console.log('hi');
    req.login(user, err => {
      if (err) {
        return next(err);
      }
    });
    res.status(200).json(user);
  })(req, res, next);
});

server.listen(8000, () => {
  console.log('server is up on port 8000');
});

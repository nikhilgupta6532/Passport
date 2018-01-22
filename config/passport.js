const passport = require('passport');
//const Strategy = require('passport-local');
var LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');

passport.serializeUser((user, done) => {
  console.log('hello1');
  done(null, user.rows[0].id);
});

passport.deserializeUser((id, done) => {
  console.log('hello2');
  client.execute('select * from users where id=?', [id], (err, user) => {
    if (!err) {
      console.log('done');
      done(null, user);
    }
  });
});
passport.use(
  new LocalStrategy((username, password, done) => {
    client.execute(
      'select * from users where username=?',
      [username],
      (err, user) => {
        if (!err) {
          if (user.rows.length == 0) {
            //new user
            var token = jwt.sign(
              { user_id: username, access: 'hello' },
              'abc123'
            );
            client.execute(
              'insert into users(id,username,password,tokens)values(now(),?,?,?)',
              [username, password, token],
              (err, result) => {
                if (!err) {
                  console.log('insertion is successfuull');
                  client.execute(
                    'select * from users where username=?',
                    [username],
                    (err, result) => {
                      if (!err) {
                        console.log('done');
                        done(null, result);
                      }
                    }
                  );
                }
              }
            );
          } else {
            //old user
            console.log(user);
            done(null, user);
          }
        }
      }
    );
  })
);

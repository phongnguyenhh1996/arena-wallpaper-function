const { admin, db } = require('../utils/admin');
const firebase = require('firebase');
const configFirebase = require('../utils/configFirebase');
const { validateSignupData, validateLoginData, reduceUserDetails } = require('../utils/validators');
const { ADMIN_EMAIL } = require('../utils/constants')

firebase.initializeApp(configFirebase)

exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    username: req.body.username
  }
  const { errors, valid } = validateSignupData(newUser);
  if (!valid) {
    return res.status(400).json(errors);
  }
  let idToken, userId;
  db.doc(`/users/${newUser.username}`)
    .get()
    .then(user => {
      if (user.exists) {
        return res.status(400).json({
          username: 'this username is already taken'
        });
      } else {
        return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
      }
    })
    .then(user => {
      userId = user.user.uid;
      return user.user.getIdToken();
    })
    .then(token => {
      idToken = token;
      const userCredentials = {
        username: newUser.username,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        id: userId
      }
      return db.doc(`/users/${userCredentials.username}`).set(userCredentials);
    })
    .then(() => res.status(200).json({
      token: idToken
    }))
    .catch(error => {
      console.error(error);
      res.status(500).json(error);
    })
}

exports.login = (req, res) => {
  const user = {
    email: req.body.username,
    password: req.body.password
  }

  const { errors, valid } = validateLoginData(user);
  if (!valid) {
    return res.status(400).json(errors);
  }

  if (req.query.isAdmin && !ADMIN_EMAIL.includes(user.email)) {
    return res.status(403).json({ error: 'invalid admin account'});
  }

  firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(data => data.user.getIdToken())
    .then(token => res.status(200).json({ token }))
    .catch(err => {
      console.error(err);
      return res.status(500).json(err);
    })
}

exports.getMe = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.user.username}`).get()
    .then(data => {
      if (data.exists) {
        userData.credentials = data.data();
        return res.json(userData);
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json(err);
    })
}
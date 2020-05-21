const functions = require('firebase-functions');
const cors = require('cors')({origin: true});
const express = require('express');
const app = express();
const FBAuth = require('./utils/fbAuth');
const isAdmin = require('./utils/isAdmin');
const {
  signup,
  login,
  getMe
} = require('./handlers/user');
const { getAllMedia, uploadMedia } = require('./handlers/media')
const { getCategories, createCategory } = require('./handlers/categories')

app.use(cors);

// user route
app.post('/signup', signup);
app.post('/login', login);
app.get('/me', FBAuth, getMe);

//media
app.get('/media', FBAuth, isAdmin, getAllMedia)
app.post('/media', FBAuth, isAdmin, uploadMedia)

// categories
app.get('/categories', getCategories);
app.post('/categories', FBAuth, isAdmin, createCategory);

exports.api = functions.https.onRequest(app);
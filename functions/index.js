const functions = require('firebase-functions');
const cors = require('cors')({origin: true});
const express = require('express');
const app = express();
const FBAuth = require('./utils/fbAuth');
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
app.get('/media', getAllMedia)
app.post('/upload', uploadMedia)

// categories
app.get('/categories', getCategories);
app.post('/categories', createCategory);

exports.api = functions.https.onRequest(app);
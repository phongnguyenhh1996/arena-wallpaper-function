const admin = require('firebase-admin');
const serviceAccount = require('../service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://social-ape-43919.appspot.com'
});

const db = admin.firestore();

module.exports = { admin, db };
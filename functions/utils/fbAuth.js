const { admin, db } = require('./admin');

module.exports = (req, res, next) => {
  let idToken;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    console.error('Token not found');
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  admin.auth().verifyIdToken(idToken)
    .then(decodeResponse => {
      req.user = decodeResponse;
      return db.collection('users')
        .where('id', '==', req.user.uid)
        .limit(1)
        .get()
    })
    .then(data => {
      req.user.username = data.docs[0].data().username;
      return next();
    })
    .catch(err => {
      console.error(err);
      res.status(403).json(err);
    })
}
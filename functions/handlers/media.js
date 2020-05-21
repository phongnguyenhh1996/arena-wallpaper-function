const { db, admin } = require('../utils/admin.js');
const configFirebase = require('../utils/configFirebase');

exports.getAllMedia = (req, res) => {
  db
    .collection('media')
    .get()
    .then((data) => {
      let media = [];
      data.forEach(doc => {
        media.push({
          id: doc.id,
          createdAt: doc.data().createdAt,
          imageUrl: doc.data().imageUrl,
        });
      });
      res.set('Access-Control-Expose-Headers', "X-Total-Count")
      res.set('X-Total-Count', media.length.toString())
      return res.json(media);
    })
    .catch(err => console.log(err))
}

exports.uploadMedia = (req, res) => {
  const Busboy = require('busboy');
  const path = require('path');
  const os = require('os');
  const fs = require('fs');

  const busboy = new Busboy({ headers: req.headers });
  let imageFilename;
  let imageToBeUploaded = {};
  let imgData = {}
  busboy.on('file', (fieldname, file, filename, encoding, mimeType) => {
    if (mimeType !== 'image/png' && mimeType !== 'image/jpeg') {
      return res.status(400).json({ error: 'Wrong file type.' });
    }
    const fileExtension = filename.split('.')[filename.split('.').length - 1];
    imageFilename = `${Math.round(Math.random() * 1000000000000)}.${fileExtension}`;
    const filepath = path.join(os.tmpdir(), imageFilename);
    imageToBeUploaded = { filepath, mimeType };
    file.pipe(fs.createWriteStream(filepath));
  })
  busboy.on('finish', () => {
    admin.storage().bucket().upload(imageToBeUploaded.filepath, {
      resumable: false,
      metadata: {
        metadata: {
          contentType: imageToBeUploaded.mimeType
        }
      }
    })
    .then(() => {
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${configFirebase.storageBucket}/o/${imageFilename}?alt=media`;
      imgData = {
        imageUrl: imageUrl,
        createdAt: new Date().toISOString()
      }
      return db.collection('media').add(imgData)
    })
    .then(doc => {
      imgData.id = doc.id;
      return db.doc(`media/${doc.id}`).update({id: doc.id})
    })
    .then(() => {
      return res.json({ message: 'Image uploaded successfully', data: imgData});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json(err);
    })
  })
  busboy.end(req.rawBody);
}
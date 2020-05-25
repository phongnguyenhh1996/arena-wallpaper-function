const { db } = require('../utils/admin.js');

exports.getWallpapers = (req, res) => {
  db
    .collection('wallpapers')
    .get()
    .then((data) => {
      let wallpapers = [];
      data.forEach(doc => {
        wallpapers.push({
          id: doc.id,
          name: doc.data().name,
          description: doc.data().description,
          viewCount: doc.data().viewCount,
          useCount: doc.data().useCount,
          createdAt: doc.data().createdDate,
          image: doc.data().image,
          hero: doc.data().hero,
          category: doc.data().category
        });
      });
      res.set('Access-Control-Expose-Headers', "X-Total-Count")
      res.set('X-Total-Count', wallpapers.length.toString())
      return res.json(wallpapers);
    })
    .catch(err => console.log(err))
}

exports.createWallpaper = (req, res) => {
  const newWallpaper = {
    image: req.body.image,
    name: req.body.name,
    description: req.body.description,
    createdDate: new Date().toISOString(),
    viewCount: 0,
    useCount: 0,
    hero: req.body.hero,
    categoryId: req.body.categoryId
  };
  const categoryId = req.body.categoryId;
  db.doc(`categories/${categoryId}`).get()
    .then(doc => {
      if (doc.exists) {
        newWallpaper.category = doc.data()
        console.log(newWallpaper);
        
        return db.collection('wallpapers').add(newWallpaper)
      }
    })
    .then((doc) => {
      console.log(doc)
      const resWallpaper = newWallpaper;
      resWallpaper.id = doc.id;
      return res.json(resWallpaper);
    })
    .catch(err => {
      res.status(500).json({
        error: 'something went wrong'
      });
      console.error(err);
    })
}
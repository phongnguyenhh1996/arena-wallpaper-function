const { db } = require('../utils/admin.js');

exports.getCategories = (req, res) => {
  db
    .collection('categories')
    .get()
    .then((data) => {
      let categories = [];
      data.forEach(doc => {
        categories.push({
          id: doc.id,
          name: doc.data().name,
          viewCount: doc.data().viewCount,
          createdDate: doc.data().createdDate,
          imgUrl: doc.data().imgUrl,
        });
      });
      return res.json(categories);
    })
    .catch(err => console.log(err))
}

exports.createCategory = (req, res) => {
  const newCategory = {
    imgUrl: 'https://firebasestorage.googleapis.com/v0/b/arenawallpaper.appspot.com/o/2518f411592ac4e60cd3baff711a5597.jpg?alt=media',
    name: req.body.name,
    createdDate: new Date().toISOString(),
    viewCount: 0
  };
  
  db
    .collection('categories')
    .add(newCategory)
    .then((doc) => {
      const resCategory = newCategory;
      resCategory.id = doc.id;
      return res.json(resCategory);
    })
    .catch(err => {
      res.status(500).json({
        error: 'something went wrong'
      });
      console.error(err);
    })
}
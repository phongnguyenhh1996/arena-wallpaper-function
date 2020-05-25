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
          createdAt: doc.data().createdAt,
          image: doc.data().image,
        });
      });
      res.set('Access-Control-Expose-Headers', "X-Total-Count")
      res.set('X-Total-Count', categories.length.toString())
      return res.json(categories);
    })
    .catch(err => console.log(err))
}

exports.createCategory = (req, res) => {
  const newCategory = {
    image: req.body.image,
    name: req.body.name,
    createdAt: new Date().toISOString(),
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
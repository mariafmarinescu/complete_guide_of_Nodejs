const mongodb = require('mongodb');
const getdb = require('../util/database').getDb;

class Product {
  constructor(id, title, imageUrl, description, price) {
      this._id = id ? new mongodb.ObjectId(id) : null;
      this.title = title;
      this.imageUrl = imageUrl;
      this.description = description;
      this.price = price;
  }

  save() {
    const db = getdb();
    let dbOp;
    if(this._id) {
        dbOp = db
        .collection('products')
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection('products').insertOne(this);
    }
    return dbOp
      .then(result => {
        console.log(result);
      }).catch(err => console.log(err));

  }


    static fetchAll() {
      const db = getDb();
      return db
        .collection('products')
        .find()
        .toArray()
        .then(products => {
          console.log(products);
          return products;
        }).catch(err => {console.log(err)});
    }

    static findById(prodId) {
      const db = getDb();
      return db
        .collection('products')
        .find({ _id: new mongodb.ObjectId(prodId)})
        .next()
        .then(products => {
          console.log(products);
          return products;
        }).catch(err => {console.log(err)});
    }

    static deleteById(prodId) {
      const db = getDb();
      return db
        .collection('products')
        .find({ _id: new mongodb.ObjectId(prodId)})
        .then(products => {
          console.log('product deleted successfully');
        }).catch(err => {console.log(err)});
    }

};

module.exports = Product;

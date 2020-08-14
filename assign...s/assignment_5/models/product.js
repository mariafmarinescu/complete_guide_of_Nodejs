const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

productSchema.pre('validate', function() {
  console.log('valid - checked');
});
productSchema.post('validate', function() {
  console.log('valid - known');
});
productSchema.pre('save', function() {
  console.log('save - registered');
});
productSchema.post('save', function() {
  console.log('saved successfully');
});

module.exports = mongoose.model('Product', productSchema);

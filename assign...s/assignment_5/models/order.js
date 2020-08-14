const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  user: {
    name: {
      type: String,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  }
});

orderSchema.pre('validate', function() {
  console.log('valid - checked');
});
orderSchema.post('validate', function() {
  console.log('valid - known');
});
orderSchema.pre('save', function() {
  console.log('save - registered');
});
orderSchema.post('save', function() {
  console.log('saved successfully');
});

module.exports = mongoose.model('Order', orderSchema);

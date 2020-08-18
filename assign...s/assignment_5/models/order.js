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
  console.log('order will be valid - checked');
});
orderSchema.post('validate', function() {
  console.log('order is valid - known');
});
orderSchema.pre('save', function() {
  console.log('order - registered');
});
orderSchema.post('save', function() {
  console.log('Order saved successfully');
});

module.exports = mongoose.model('Order', orderSchema);

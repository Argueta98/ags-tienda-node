const mongoose = require('mongoose');
const { Schema } = mongoose;

const salesSchema = new Schema ({
  nombreProducto: { type: String, required: true},
  descProducto: { type: String, required: true},
  tipoProducto: { type: Number, required: true},
  cantProducto: { type: Number, required: true},
  valorProducto: { type: Number, required: true},
  dateProducto: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sales', salesSchema);

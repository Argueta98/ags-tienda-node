const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const usuarioSchema = new Schema({
  usuario: { type: String, required: true },
  correo: { type: String, required: true },
  contra: { type: String, required: true },
  tipoU: { type: String, required: true },
  date: { type: Date, default: Date.now},
});

usuarioSchema.methods.encryptPassword = async (contraUsuario1) => {
  const salt = await bcrypt.genSalt(10);
  const hash = bcrypt.hash(contraUsuario1, salt);
  return await hash;
};

usuarioSchema.methods.matchPassword = async function (contraUsuario1) {
  return await bcrypt.compare(contraUsuario1, this.contra);
};

module.exports = mongoose.model('User', usuarioSchema);

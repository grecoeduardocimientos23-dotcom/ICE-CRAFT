const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema({
    usuario: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rol: { type: String, default: "usuario" } // usuario o admin
});

module.exports = mongoose.model("Usuario", UsuarioSchema);

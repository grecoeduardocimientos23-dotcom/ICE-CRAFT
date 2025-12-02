const mongoose = require("mongoose");

const ventaSchema = new mongoose.Schema({
    usuario: { type: String, required: true },
    producto: { type: String, required: true },
    cantidad: { type: Number, required: true },
    total: { type: Number, required: true },
    fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Venta", ventaSchema);

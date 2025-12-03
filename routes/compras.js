const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Traemos el modelo Compra correctamente
const Compra = mongoose.model("compras");

// ➤ OBTENER TODAS LAS COMPRAS
router.get("/", async (req, res) => {
    try {
        const compras = await Compra.find().sort({ fecha: -1 });
        res.json(compras);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ➤ REGISTRAR UNA COMPRA
router.post("/", async (req, res) => {
    try {
        const nuevaCompra = new Compra(req.body);
        await nuevaCompra.save();
        res.json({ mensaje: "Compra guardada", compra: nuevaCompra });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ➤ ACTUALIZAR UNA COMPRA
router.put("/:id", async (req, res) => {
    try {
        const compra = await Compra.findByIdAndUpdate(req.params.id, req.body);
        res.json({ mensaje: "Compra actualizada", compra });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ➤ ELIMINAR UNA COMPRA
router.delete("/:id", async (req, res) => {
    try {
        const compra = await Compra.findByIdAndDelete(req.params.id);
        res.json({ mensaje: "Compra eliminada", compra });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ➤ ELIMINAR TODAS LAS COMPRAS (OPCIONAL)
router.delete("/", async (req, res) => {
    try {
        await Compra.deleteMany({});
        res.json({ mensaje: "Todas las compras fueron eliminadas" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

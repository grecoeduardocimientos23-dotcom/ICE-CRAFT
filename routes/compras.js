const express = require("express");
const router = express.Router();
const Compra = require("../models/Compra");

// ➤ OBTENER TODAS LAS COMPRAS
router.get("/", async (req, res) => {
    try {
        const compras = await Compra.find();
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

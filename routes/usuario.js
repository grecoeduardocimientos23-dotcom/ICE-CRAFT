const express = require("express");
const router = express.Router();
const Usuario = require("../models/usuario");

router.post("/login", async (req, res) => {
    const { usuario, password } = req.body;

    try {
        const user = await Usuario.findOne({ usuario });

        if (!user) {
            return res.json({ ok: false, mensaje: "Usuario no encontrado" });
        }

        if (user.password !== password) {
            return res.json({ ok: false, mensaje: "Contraseña incorrecta" });
        }

        return res.json({
            ok: true,
            nombre: user.usuario,
            rol: user.rol
        });

    } catch (err) {
        console.log(err);
        res.json({ ok: false, mensaje: "Error interno del servidor" });
    }
});

module.exports = router;


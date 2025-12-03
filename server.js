const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ======================================
// 🔗 CONEXIÓN A MONGODB ATLAS
// ======================================
mongoose.connect(
  "mongodb+srv://Eduardocasares:casares1101@cluster0.n8e99xp.mongodb.net/IceCraft?retryWrites=true&w=majority&appName=Cluster0"
)
.then(() => console.log("✔ Conectado a MongoDB Atlas"))
.catch(err => console.log("❌ Error al conectar:", err));


// ======================================
// 📌 SERVIR ARCHIVOS DEL FRONTEND
// ======================================

// ARCHIVOS HTML, CSS, JS (ponlos en la carpeta /public/)
app.use(express.static(path.join(__dirname, "public")));

// SI ENTRAN A LA PÁGINA PRINCIPAL, MOSTRAR login.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});


// ======================================
// MODELOS
// ======================================
const Usuario = mongoose.model("usuarios", {
  nombre: String,
  email: String,
  password: String,
  rol: { type: String, default: "usuario" }
});

const Comentario = mongoose.model("comentarios", {
  texto: String,
  fecha: String
});

const Compra = mongoose.model("compras", {
  usuario: String,
  producto: String,
  cantidad: Number,
  total: Number,
  fecha: { type: Date, default: Date.now }
});

// ======================================
// RUTAS
// ======================================

// Ruta de prueba
app.get("/compras/test", (req, res) => {
  res.json({ ok: true, mensaje: "Ruta de pruebas funcionando en Render" });
});

// Registrar usuario
app.post("/register", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password)
      return res.json({ ok: false, mensaje: "Faltan datos" });

    const existe = await Usuario.findOne({ email });
    if (existe) return res.json({ ok: false, mensaje: "El correo ya existe" });

    const nuevo = new Usuario({ nombre, email, password });
    await nuevo.save();

    res.json({ ok: true, mensaje: "Usuario registrado correctamente" });
  } catch (err) {
    res.json({ ok: false, mensaje: "Error al registrar usuario" });
  }
});

// LOGIN
app.post("/usuarios/login", async (req, res) => {
  const { usuario, password } = req.body;

  try {
    if (usuario === "admin" && password === "1234") {
      return res.json({
        ok: true,
        mensaje: "Bienvenido Admin",
        nombre: "Administrador",
        rol: "admin"
      });
    }

    const user = await Usuario.findOne({ nombre: usuario });
    if (!user) return res.json({ ok: false, mensaje: "Usuario no encontrado" });

    if (user.password !== password)
      return res.json({ ok: false, mensaje: "Contraseña incorrecta" });

    res.json({
      ok: true,
      mensaje: "Login correcto",
      nombre: user.nombre,
      rol: user.rol
    });

  } catch (err) {
    res.json({ ok: false, mensaje: "Error en el servidor" });
  }
});

// Eliminar usuario
app.delete("/usuarios/eliminar", async (req, res) => {
  const { usuario } = req.body;

  if (!usuario)
    return res.json({ ok: false, mensaje: "Falta el usuario" });

  try {
    const eliminado = await Usuario.findOneAndDelete({ nombre: usuario });
    if (!eliminado)
      return res.json({ ok: false, mensaje: "Usuario no encontrado" });

    res.json({ ok: true, mensaje: "Usuario eliminado correctamente" });
  } catch (err) {
    res.json({ ok: false, mensaje: "Error al eliminar usuario" });
  }
});

// Guardar comentario
app.post("/comentarios", async (req, res) => {
  try {
    const { texto } = req.body;
    if (!texto) return res.json({ ok: false, mensaje: "Comentario vacío" });

    const nuevo = new Comentario({
      texto,
      fecha: new Date().toLocaleString()
    });

    await nuevo.save();
    res.json({ ok: true, mensaje: "Comentario guardado correctamente" });
  } catch (err) {
    res.json({ ok: false, mensaje: "Error al guardar comentario" });
  }
});

// Obtener comentarios
app.get("/comentarios", async (req, res) => {
  const lista = await Comentario.find();
  res.json(lista);
});

// Eliminar comentarios
app.delete("/comentarios", async (req, res) => {
  await Comentario.deleteMany({});
  res.json({ ok: true, mensaje: "Todos los comentarios fueron eliminados" });
});

// Registrar compra
app.post("/compras", async (req, res) => {
  try {
    const { usuario, producto, cantidad, total } = req.body;

    if (!usuario || !producto || !cantidad || !total)
      return res.json({ ok: false, mensaje: "Faltan datos de compra" });

    const compra = new Compra({
      usuario,
      producto,
      cantidad: Number(cantidad),
      total: Number(total)
    });

    await compra.save();

    res.json({ ok: true, mensaje: "Compra registrada correctamente" });
  } catch (err) {
    res.json({ ok: false, mensaje: "Error al registrar compra" });
  }
});

// Obtener compras
app.get("/compras", async (req, res) => {
  try {
    const compras = await Compra.find().sort({ fecha: -1 });
    res.json(compras);
  } catch (err) {
    res.json({ ok: false, mensaje: "Error al obtener compras" });
  }
});

// Actualizar compra
app.put("/compras/:id", async (req, res) => {
  try {
    const compraActualizada = await Compra.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!compraActualizada)
      return res.status(404).json({ ok: false, mensaje: "Compra no encontrada" });

    res.json({
      ok: true,
      mensaje: "Compra actualizada correctamente",
      compra: compraActualizada
    });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: "Error al actualizar compra", detalle: err });
  }
});

// Eliminar compra
app.delete("/compras/:id", async (req, res) => {
  try {
    await Compra.findByIdAndDelete(req.params.id);
    res.json({ ok: true, mensaje: "Compra eliminada" });
  } catch (err) {
    res.json({ ok: false, mensaje: "Error al eliminar compra" });
  }
});

// ======================================
// 🚀 INICIAR SERVIDOR (RENDER FRIENDLY)
// ======================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Servidor funcionando en puerto " + PORT);
});

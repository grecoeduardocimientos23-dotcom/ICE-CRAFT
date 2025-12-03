const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// ======================================
// MIDDLEWARES
// ======================================
app.use(cors());
app.use(express.json());

// Servir archivos del frontend
app.use(express.static("Public"));


// ======================================
// 🔗 CONEXIÓN A MONGODB ATLAS
// ======================================
mongoose.connect(
  "mongodb+srv://Eduardocasares:casares1101@cluster0.n8e99xp.mongodb.net/IceCraft?retryWrites=true&w=majority&appName=Cluster0"
)
.then(() => console.log("✔ Conectado a MongoDB Atlas"))
.catch(err => console.log("❌ Error al conectar:", err));


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
// 📌 RUTAS DEL BACKEND (API)
// ======================================

// Ruta de prueba
app.get("/compras/test", (req, res) => {
  res.json({ ok: true, mensaje: "Ruta de pruebas funcionando en Render" });
});

// Registrar usuario
app.post("/register", async (req, res) => {
  const { nombre, email, password } = req.body;
  const nuevo = new Usuario({ nombre, email, password });
  await nuevo.save();
  res.json({ ok: true });
});

// LOGIN
app.post("/usuarios/login", async (req, res) => {
  const { usuario, password } = req.body;
  const user = await Usuario.findOne({ nombre: usuario });

  if (!user) return res.json({ ok: false, mensaje: "Usuario no encontrado" });
  if (user.password !== password) return res.json({ ok: false, mensaje: "Contraseña incorrecta" });

  res.json({ ok: true, nombre: user.nombre, rol: user.rol });
});


// ======================================
// 📌 RUTAS DEL FRONTEND
// ======================================


// Página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/Public/index.html"));
});


// ESTA RUTA SE MUEVE AL FINAL
app.get("/:page", (req, res) => {
  const file = req.params.page + ".html";
  res.sendFile(path.join(__dirname, "Public", file));
});


// ======================================
// 🚀 INICIAR SERVIDOR
// ======================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("🚀 Servidor en puerto", PORT);
});

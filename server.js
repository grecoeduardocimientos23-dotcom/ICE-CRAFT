const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// ======================================
// MIDDLEWARES
// ======================================
app.use(express.json());
app.use(express.static("Public"));
app.use(cors({
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type"
}));

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
// 📌 RUTAS DEL FRONTEND
// ======================================

// Página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Public", "index.html"));
});

// Cargar cualquier archivo HTML
app.get("/:page", (req, res) => {
  res.sendFile(path.join(__dirname, "Public", `${req.params.page}.html`));
});


// ======================================
// 📌 RUTAS BACKEND (API)
// ======================================

// ✔ Ruta de prueba
app.get("/compras/test", (req, res) => {
  res.json({ ok: true, mensaje: "API funcionando correctamente 👍" });
});


// ======================================
// REGISTRO
// ======================================
app.post("/register", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password)
      return res.json({ ok: false, mensaje: "Faltan datos" });

    const existe = await Usuario.findOne({ email });
    if (existe)
      return res.json({ ok: false, mensaje: "El correo ya existe" });

    await new Usuario({ nombre, email, password }).save();

    res.json({ ok: true, mensaje: "Usuario registrado correctamente" });

  } catch (err) {
    res.json({ ok: false, mensaje: "Error al registrar usuario" });
  }
});


// ======================================
// LOGIN (FUNCIONA con nombre O email)
// ======================================
app.post("/usuarios/login", async (req, res) => {

  const { usuario, password } = req.body;

  try {
    // SUPERADMIN
    if (usuario === "admin" && password === "1234") {
      return res.json({
        ok: true,
        mensaje: "Bienvenido Admin",
        nombre: "Administrador",
        rol: "admin"
      });
    }

    // Buscar por NOMBRE o EMAIL
    const user = await Usuario.findOne({
      $or: [{ nombre: usuario }, { email: usuario }]
    });

    if (!user)
      return res.json({ ok: false, mensaje: "Usuario no encontrado" });

    if (user.password !== password)
      return res.json({ ok: false, mensaje: "Contraseña incorrecta" });

    res.json({
      ok: true,
      mensaje: "Login correcto",
      nombre: user.nombre,
      email: user.email,
      rol: user.rol
    });

  } catch (err) {
    res.json({ ok: false, mensaje: "Error en el servidor" });
  }
});


// ======================================
// ELIMINAR USUARIO
// ======================================
app.delete("/usuarios/eliminar", async (req, res) => {
  const { usuario } = req.body;

  if (!usuario)
    return res.json({ ok: false, mensaje: "Falta el usuario" });

  try {
    const eliminado = await Usuario.findOneAndDelete({ nombre: usuario });

    if (!eliminado)
      return res.json({ ok: false, mensaje: "Usuario no encontrado" });

    res.json({ ok: true, mensaje: "Usuario eliminado correctamente" });
  } catch {
    res.json({ ok: false, mensaje: "Error al eliminar usuario" });
  }
});


// ======================================
// COMENTARIOS
// ======================================
app.post("/comentarios", async (req, res) => {
  try {
    const { texto } = req.body;
    if (!texto)
      return res.json({ ok: false, mensaje: "Comentario vacío" });

    await new Comentario({
      texto,
      fecha: new Date().toLocaleString()
    }).save();

    res.json({ ok: true, mensaje: "Comentario guardado correctamente" });

  } catch {
    res.json({ ok: false, mensaje: "Error al guardar comentario" });
  }
});

app.get("/comentarios", async (req, res) => {
  res.json(await Comentario.find());
});

app.delete("/comentarios", async (req, res) => {
  await Comentario.deleteMany({});
  res.json({ ok: true, mensaje: "Todos los comentarios fueron eliminados" });
});


// ======================================
// COMPRAS
// ======================================
app.post("/compras", async (req, res) => {
  try {
    const { usuario, producto, cantidad, total } = req.body;

    if (!usuario || !producto || !cantidad || !total)
      return res.json({ ok: false, mensaje: "Faltan datos de compra" });

    await new Compra({
      usuario,
      producto,
      cantidad: Number(cantidad),
      total: Number(total)
    }).save();

    res.json({ ok: true, mensaje: "Compra registrada correctamente" });

  } catch {
    res.json({ ok: false, mensaje: "Error al registrar compra" });
  }
});

app.get("/compras", async (req, res) => {
  res.json(await Compra.find().sort({ fecha: -1 }));
});

app.put("/compras/:id", async (req, res) => {
  try {
    const compraActualizada = await Compra.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!compraActualizada)
      return res.json({ ok: false, mensaje: "Compra no encontrada" });

    res.json({
      ok: true,
      mensaje: "Compra actualizada correctamente",
      compra: compraActualizada
    });

  } catch (err) {
    res.json({ ok: false, mensaje: "Error al actualizar compra" });
  }
});

app.delete("/compras/:id", async (req, res) => {
  try {
    await Compra.findByIdAndDelete(req.params.id);
    res.json({ ok: true, mensaje: "Compra eliminada" });

  } catch {
    res.json({ ok: false, mensaje: "Error al eliminar compra" });
  }
});


// ======================================
// 🚀 INICIAR SERVIDOR
// ======================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Servidor en puerto", PORT);
});

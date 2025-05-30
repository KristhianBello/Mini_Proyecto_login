const express = require('express');
require('dotenv').config();
const app = express();
const db = require('./db'); //conexion con MYSQL
const PORT = process.env.PORT || 3000;


// Middleware para datos del formulario
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static('public'));


// Ruta de inicio
app.get('/', (req, res) => {
    //res.sendFile(__dirname + '/public/index.html');
    res.sendFile(__dirname + '/public/index.html');

});

// -----------------------------------------Ruta de login---------------------------------------------------------
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).send('❌ Faltan datos');
  }

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).send('❌ Error del servidor');
    }

    if (results.length > 0) {
      // Usuario encontrado
      return res.redirect('/registro.html');
    } else {
      res.send('❌ Credenciales incorrectas');
    }
  });
});


// ---------------------------------register-----------------------------------------------------------
app.post('/register', (req, res) => {
  const email = req.body.email.trim();
  const password = req.body.password.trim();

  const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
  db.query(query, [email, password], (err, result) => {
    if (err) {
      console.error('Error al registrar usuario:', err);
      return res.send('Error al registrar. El correo ya existe o hay un problema.');
    }
    res.send('✅ Usuario registrado correctamente. Ahora puedes iniciar sesión.');
  });
});

//---------------------------------------------Forgot-password-----------------------------------------------------------
app.post('/forgot-password', (req, res) => {
  const email = req.body.email.trim();

  const query = 'SELECT password FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error al recuperar contraseña:', err);
      return res.status(500).send('Error interno');
    }

    if (results.length > 0) {
      const contraseña = results[0].password;
      res.send(`Tu contraseña es: ${contraseña}`);
    } else {
      res.send('❌ Correo no registrado.');
    }
  });
});

// ------------------------------------- Ruta que recibe el formulario --------------------------------------
app.post('/registrar-persona', (req, res) => {
  const { nombre, cedula, direccion, telefono, correo} = req.body;

  const query = 'INSERT INTO personas (nombre, cedula, direccion, telefono, correo) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [nombre, cedula, direccion, telefono, correo,], (err, result) => {
    if (err) {
      console.error('Error al registrar persona:', err);
      return res.status(500).send('Error al registrar persona');
    }

    res.send('Persona registrada correctamente.');
  });
});



// ------------------------------------------Iniciar el servidor-------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`🟢 Servidor escuchando en http://localhost:${PORT}`);
});

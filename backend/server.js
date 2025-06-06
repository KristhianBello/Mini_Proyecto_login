const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const db = require('./db');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware para datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir archivos estáticos del frontend
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));


// Ruta de inicio
app.get('/', (req, res) => {
    //res.sendFile(__dirname + '/public/index.html');

    res.sendFile(path.join(publicPath, 'index.html'), (err) => {
        if (err) {
            console.error('Error al enviar el archivo:', err);
            res.status(err.status).end();
        } else {
            console.log('Archivo enviado correctamente');
        }
    });

});


// Ruta de login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error al buscar usuario:', err);
      return res.status(500).send('Error interno del servidor');
    }

    if (!results.length > 0) {
      res.send('✅ ¡Login exitoso!');
    } else {
      res.send('❌ Credenciales incorrectas');
    }
  });
});

// register
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

//Forgot-password
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


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🟢 Servidor escuchando en http://localhost:${PORT}`);
});

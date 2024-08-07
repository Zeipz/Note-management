require('dotenv').config();
const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const routes = require('./routes');
const { sequelize } = require('./models');



const app = express();

// Configuración de Handlebars
app.engine('handlebars', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts/'),
    partialsDir: path.join(__dirname, 'views/partials/'),
    helpers: {
        eq: function (v1, v2) {
            return v1 === v2;
        }
    },
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
app.set('view engine', 'handlebars');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/', routes);

// Manejo de errores 404
app.use((req, res, next) => {
    res.status(404).render('error', { message: 'Página no encontrada' });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { message: 'Error interno del servidor' });
});



// Sincronización de la base de datos y arranque del servidor
const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida con éxito.');
    return sequelize.sync(); // Sincroniza los modelos con la base de datos
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al iniciar la aplicación:', err);
  });
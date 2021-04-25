// Importações

const express = require('express');
const routes = express.Router();

const studentController = require('../controllers/studentController');
const geoController = require('../controllers/geoController');

// Rotas

routes.get('/students', studentController.index);
routes.get('/students/:registration', studentController.show);
routes.post('/students', studentController.create);
routes.post('/manyStudents', studentController.createMany);
routes.put('/students/:registration', studentController.update);
routes.delete('/students/:registration', studentController.destroy);

routes.get('/svg/:city', geoController.getSvg);
routes.get('/viewBox/:city', geoController.getViewBox);

// Exportações

module.exports = routes;
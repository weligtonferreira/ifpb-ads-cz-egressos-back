// Importações

const express = require('express');
const routes = express.Router();

const studentController = require('../controllers/studentController');
const geoController = require('../controllers/geoController');

// Rotas

routes.get('/students', studentController.index);
routes.get('/students/:matricula', studentController.show);
routes.post('/students', studentController.create);
routes.post('/manyStudents', studentController.createMany);
routes.put('/students/:matricula', studentController.update);
routes.delete('/students/:matricula', studentController.destroy);

routes.get('/svg/:city', geoController.getSvg);
routes.get('/viewBox/:city', geoController.getViewBox);

// Exportações

module.exports = routes;
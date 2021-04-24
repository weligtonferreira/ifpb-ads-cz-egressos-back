// Importações

const express = require('express');
const cors = require('cors');

// Configurações

const app = express();
const routes = require('./routes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(routes);

// Exportações

module.exports = app;
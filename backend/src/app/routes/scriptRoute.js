const express = require('express');
const { synthesizeScript } = require('../controllers/ScriptController');

const scriptRoute = express.Router();

// Định nghĩa route cho Text to Script
scriptRoute.post('/', synthesizeScript);

module.exports = scriptRoute;

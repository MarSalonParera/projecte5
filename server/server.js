const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jocRoutes = require('./routes/jocRoutes');

async function iniciar() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/joc_caselles');
        console.log("MongoDB connectat correctament.");
    } catch (err) {
        console.error("Error connectant a MongoDB:", err);
        process.exit(1);
    }

    const app = express();

    app.set('view engine', 'pug');
    app.set('views', path.join(__dirname, '../views'));

    app.use(express.static(path.join(__dirname, '../public')));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use('/', jocRoutes);

    app.listen(8888, () => console.log('Servidor Express iniciat a http://localhost:8888'));
}

exports.iniciar = iniciar;
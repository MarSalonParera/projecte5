const Sala = require('../models/Sala');

// Crear una nova sala
exports.crearSala = async (req, res) => {
    // Generem un ID curt de 4 dígits per a que sigui llegible
    const sala = new Sala({ idSala: Math.floor(1000 + Math.random() * 9000).toString() });
    await sala.save();
    res.json({ idSala: sala.idSala });
};

// Unir-se a una sala existent
exports.unirJugador = async (req, res) => {
    const { idSala, nom } = req.body;
    const sala = await Sala.findOne({ idSala });
    if (!sala) return res.status(404).json({ error: 'Sala no trobada' });
    if (sala.jugadors.length >= 2) return res.status(400).json({ error: 'Sala plena' });

    const color = sala.jugadors.length === 0 ? 'jug1' : 'jug2';
    sala.jugadors.push({ idJugador: Date.now().toString(), nom, color });
    await sala.save();
    res.json({ idJugador: sala.jugadors[sala.jugadors.length - 1].idJugador, color });
};

// Marcar una casella
exports.marcarCasella = async (req, res) => {
    const { idSala, fila, columna, jugador } = req.body;
    const sala = await Sala.findOne({ idSala });
    if (!sala) return res.status(404).json({ error: 'Sala no trobada' });

    if (!sala.tauler[fila][columna]) {
        sala.tauler[fila][columna] = jugador;
        if (jugador === 'jug1') sala.marcador.jug1++;
        else sala.marcador.jug2++;
        await sala.save();
        res.json({ success: true, tauler: sala.tauler, marcador: sala.marcador });
    } else {
        res.json({ success: false, message: 'Casella ocupada', tauler: sala.tauler, marcador: sala.marcador });
    }
};

// Obtenir estat actual de la sala
exports.estatSala = async (req, res) => {
    const { idSala } = req.query;
    const sala = await Sala.findOne({ idSala });
    if (!sala) return res.status(404).json({ error: 'Sala no trobada' });
    res.json({ tauler: sala.tauler, marcador: sala.marcador });
};
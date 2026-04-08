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
    let { idSala, nom } = req.body;
    let sala;

    if (!idSala) {
        // Matchmaking automàtic: busquem una sala que només tingui 1 jugador
        sala = await Sala.findOne({ "jugadors.1": { "$exists": false } });
    } else {
        sala = await Sala.findOne({ idSala });
    }

    if (!sala) return res.status(404).json({ error: 'Sala no trobada' });
    if (sala.jugadors.length >= 2) return res.status(400).json({ error: 'Sala plena' });

    let colorAssignat;
    const hasJug1 = sala.jugadors.some(j => j.color === 'jug1');
    const hasJug2 = sala.jugadors.some(j => j.color === 'jug2');

    if (!hasJug1) {
        colorAssignat = 'jug1';
    } else if (!hasJug2) {
        colorAssignat = 'jug2';
    }

    sala.jugadors.push({ idJugador: Date.now().toString(), nom, color: colorAssignat });
    await sala.save();
    res.json({ idJugador: sala.jugadors[sala.jugadors.length - 1].idJugador, color: colorAssignat });
};

// Marcar una casella
exports.marcarCasella = async (req, res) => {
    const { idSala, fila, columna, jugador } = req.body;
    const sala = await Sala.findOne({ idSala });
    if (!sala) return res.status(404).json({ error: 'Sala no trobada' });

    // Només es pot jugar si hi ha 2 jugadors actius
    if (sala.jugadors.length < 2) return res.status(403).json({ error: 'Esperant un altre jugador' });

    // Validem que el jugador sigui vàlid i estigui a la sala
    const jugadorValid = sala.jugadors.find(j => j.color === jugador);
    if (!jugadorValid) {
        return res.status(403).json({ error: 'Jugador no autoritzat o no vàlid' });
    }

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
    const { idSala, jugador } = req.query;
    const sala = await Sala.findOne({ idSala });
    if (!sala) return res.status(404).json({ error: 'Sala no trobada' });

    // Actualitzem el "heartbeat" del jugador que fa la petició
    const ara = new Date();
    if (jugador) {
        await Sala.updateOne(
            { idSala, "jugadors.color": jugador },
            { "$set": { "jugadors.$.ultimaActivitat": ara } }
        );
    }

    // Gestionar desconnexions: si un jugador no ha donat senyals en 5 segons
    const tempsLimit = new Date(ara.getTime() - 5000);
    const jugadorsActius = sala.jugadors.filter(j => j.ultimaActivitat > tempsLimit);
    if (jugadorsActius.length !== sala.jugadors.length) {
        sala.jugadors = jugadorsActius;
        await sala.save();
    }

    res.json({ tauler: sala.tauler, marcador: sala.marcador, jugadors: sala.jugadors });
};
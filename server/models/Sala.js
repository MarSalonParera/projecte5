const mongoose = require('mongoose');

const SalaSchema = new mongoose.Schema({
    idSala: String,  // identificador únic de la sala
    jugadors: [
        { 
            idJugador: String, 
            nom: String, 
            color: String,
            ultimaActivitat: { type: Date, default: Date.now }
        }
    ],
    tauler: { 
        type: [[String]], 
        // Creem un array 7x7 independent per cada sala
        default: () => Array.from({ length: 7 }, () => Array(7).fill(null))
    },
    marcador: { 
        jug1: { type: Number, default: 0 }, 
        jug2: { type: Number, default: 0 } 
    }
});

module.exports = mongoose.model('Sala', SalaSchema);
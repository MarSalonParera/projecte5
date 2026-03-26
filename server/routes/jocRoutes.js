const express = require('express');
const router = express.Router();
const jocCtrl = require('../controllers/jocController');

router.get('/', (req, res) => res.render('joc'));
router.post('/crearSala', jocCtrl.crearSala);
router.post('/unirJugador', jocCtrl.unirJugador);
router.post('/marcar', jocCtrl.marcarCasella);
router.get('/estatSala', jocCtrl.estatSala);

module.exports = router;
const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const auth = require('../middleware/auth');

router.post('/', auth, teamController.addTeam);
router.get('/:id', auth, teamController.getTeamsByLeague); // check on this if errors get to appear

module.exports = router;

const express = require('express');
const router = express.Router();
const leagueController = require('../controllers/leagueController');

// Create a new league
router.post('/', leagueController.createLeague);

// Get all leagues
router.get('/', leagueController.getAllLeagues);

// Get a specific league by ID
router.get('/:leagueId', leagueController.getLeagueById);

// Update a league
router.put('/:leagueId', leagueController.updateLeague);

// Delete a league
router.delete('/:leagueId', leagueController.deleteLeague);

module.exports = router;

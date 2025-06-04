const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET standings for a specific league
router.get('/:leagueId', async (req, res) => {
  const leagueId = req.params.leagueId;
  console.log('➡️ Received leagueId:', leagueId); // ✅ Log the input

  // ✅ Basic Validation: Check if it's a valid number
  if (!/^\d+$/.test(leagueId)) {
    return res.status(400).json({ error: 'Invalid leagueId. It must be a number.' });
  }

  try {
    const [results] = await db.query(
      `SELECT team_name, points, goal_difference
       FROM standings
       WHERE league_id = ?
       ORDER BY points DESC, goal_difference DESC`,
      [leagueId]
    );

    res.json(results);
  } catch (err) {
    console.error('❌ Failed to fetch standings:', err);
    res.status(500).json({ error: 'Failed to fetch standings' });
  }
});

module.exports = router;

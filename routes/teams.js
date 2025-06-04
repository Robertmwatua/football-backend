const express = require('express');
const router = express.Router();
const getConnection = require('../config/db');

router.get('/:leagueId', async (req, res) => {
  const { leagueId } = req.params;

  try {
    const connection = await getConnection();
    const [results] = await connection.query('SELECT id, name FROM teams WHERE league_id = ?', [leagueId]);
    await connection.end(); // Close connection manually
    res.json(results);
  } catch (err) {
    console.error('Direct DB error:', err);
    res.status(500).json({ message: 'Error using direct connection' });
  }
});

module.exports = router;

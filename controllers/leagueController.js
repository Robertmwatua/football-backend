const db = require('../config/db');

// 🟢 Create a new league
exports.createLeague = (req, res) => {
  const { name } = req.body;
  const userId = req.user?.userId; // Extracted from JWT middleware

  if (!name || !userId) {
    return res.status(400).json({ message: 'League name and user ID are required' });
  }

  const sql = 'INSERT INTO leagues (name, user_id) VALUES (?, ?)';
  db.query(sql, [name, userId], (err, result) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).json({ message: 'Database error while creating league' });
    }

    res.status(201).json({ message: 'League created successfully', leagueId: result.insertId });
  });
};

// 🔵 Get all leagues (optionally by user)
exports.getAllLeagues = (req, res) => {
  const userId = req.user?.userId;

  const sql = 'SELECT * FROM leagues WHERE user_id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).json({ message: 'Database error while fetching leagues' });
    }

    res.status(200).json({ leagues: results });
  });
};

// 🟡 Get a single league by ID
exports.getLeagueById = (req, res) => {
  const leagueId = req.params.leagueId;
  const userId = req.user?.userId;

  const sql = 'SELECT * FROM leagues WHERE id = ? AND user_id = ?';
  db.query(sql, [leagueId, userId], (err, results) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).json({ message: 'Error fetching league' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'League not found' });
    }

    res.status(200).json({ league: results[0] });
  });
};

// 🟠 Update a league
exports.updateLeague = (req, res) => {
  const leagueId = req.params.leagueId;
  const { name } = req.body;
  const userId = req.user?.userId;

  const sql = 'UPDATE leagues SET name = ? WHERE id = ? AND user_id = ?';
  db.query(sql, [name, leagueId, userId], (err, result) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).json({ message: 'Error updating league' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'League not found or not yours' });
    }

    res.status(200).json({ message: 'League updated successfully' });
  });
};

// 🔴 Delete a league
exports.deleteLeague = (req, res) => {
  const leagueId = req.params.leagueId;
  const userId = req.user?.userId;

  const sql = 'DELETE FROM leagues WHERE id = ? AND user_id = ?';
  db.query(sql, [leagueId, userId], (err, result) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).json({ message: 'Error deleting league' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'League not found or not yours' });
    }

    res.status(200).json({ message: 'League deleted successfully' });
  });
};

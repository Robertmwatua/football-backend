const db = require('../config/db');

exports.addTeam = async (req, res) => {
  const { name, league_id } = req.body;

  try {
    const [result] = await db.execute(
      'INSERT INTO teams (name, league_id) VALUES (?, ?)',
      [name, league_id]
    );

    res.status(201).json({ message: 'Team added', teamId: result.insertId });
  } catch (err) {
    console.error('Error adding team:', err);
    res.status(500).json({ message: 'Database error' });
  }
};

exports.getTeamsByLeague = async (req, res) => {
  const leagueId = req.params.id;

  try {
    const [results] = await db.execute(
      'SELECT * FROM teams WHERE league_id = ? ORDER BY points DESC',
      [leagueId]
    );

    res.json(results);
  } catch (err) {
    console.error('Error fetching teams:', err);
    res.status(500).json({ message: 'Database error' });
  }
};

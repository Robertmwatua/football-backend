const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Record a match and update team stats
router.post('/', async (req, res) => {
  const { leagueId, homeTeam, awayTeam, homeGoals, awayGoals, matchDate } = req.body;

  console.log("📥 Full Request Body:", req.body);
  console.log("📥 Extracted Values:", { leagueId, homeTeam, awayTeam, homeGoals, awayGoals, matchDate });

  if (!homeTeam || !awayTeam || homeGoals === undefined || awayGoals === undefined) {
    return res.status(400).json({
      message: '❌ Missing required fields. Need: homeTeam, awayTeam, homeGoals, awayGoals',
      received: req.body
    });
  }

  if (isNaN(homeGoals) || isNaN(awayGoals)) {
    return res.status(400).json({
      message: '❌ Goals must be numbers',
      received: { homeGoals, awayGoals }
    });
  }

  let connection;
  try {
    // 1. Get connection from pool
    connection = await db.getConnection();

    // 2. Begin transaction
    await connection.beginTransaction();

    // 3. Insert match
    const insertMatchSQL = `
      INSERT INTO matches 
        (league_id, team1_id, team2_id, team1_score, team2_score, match_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [insertResult] = await connection.execute(insertMatchSQL, [
      leagueId || null,
      homeTeam,
      awayTeam,
      homeGoals,
      awayGoals,
      matchDate || new Date().toISOString().slice(0, 10)
    ]);

    // 4. Calculate stats
    const calculateStats = (gf, ga) => ({
      played: 1,
      goals_for: gf,
      goals_against: ga,
      won: gf > ga ? 1 : 0,
      draw: gf === ga ? 1 : 0,
      lost: gf < ga ? 1 : 0,
      points: gf > ga ? 3 : gf === ga ? 1 : 0
    });

    const homeStats = calculateStats(homeGoals, awayGoals);
    const awayStats = calculateStats(awayGoals, homeGoals);

    // 5. Update teams
    const updateTeamSQL = `
      UPDATE teams
      SET 
        played = played + ?,
        won = won + ?,
        draw = draw + ?,
        lost = lost + ?,
        goals_for = goals_for + ?,
        goals_against = goals_against + ?,
        points = points + ?,
        goal_difference = (goals_for + ?) - (goals_against + ?)
      WHERE id = ?
    `;

    await connection.query(updateTeamSQL, [
      homeStats.played, homeStats.won, homeStats.draw, homeStats.lost,
      homeStats.goals_for, homeStats.goals_against, homeStats.points,
      homeStats.goals_for, homeStats.goals_against,
      homeTeam
    ]);

    await connection.query(updateTeamSQL, [
      awayStats.played, awayStats.won, awayStats.draw, awayStats.lost,
      awayStats.goals_for, awayStats.goals_against, awayStats.points,
      awayStats.goals_for, awayStats.goals_against,
      awayTeam
    ]);

    // 6. Commit
    await connection.commit();
    res.status(201).json({
      message: '✅ Match recorded and stats updated.',
      matchId: insertResult.insertId
    });

  } catch (error) {
    // Rollback if something failed
    if (connection) await connection.rollback();
    console.error('❌ Transaction Error:', error);
    res.status(500).json({ message: '❌ Server error recording match' });

  } finally {
    // Always release connection
    if (connection) connection.release();
  }
});

module.exports = router;

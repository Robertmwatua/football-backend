const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const db = require('./config/db'); // DB pool
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware/auth');
const standingsRoutes = require('./routes/standings');
const userRoutes = require('./routes/userRoutes');
const matchRoutes = require('./routes/matches');
const app = express();

// 1. ✅ CORS Configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 2. ✅ Core Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
// app.use('/api/standings', standingsRoutes);


// 3. ✅ Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Static file middleware (you already have this)
app.use(express.static(path.join(__dirname, 'public'), {
  index: false, // disables auto index.html
  setHeaders: (res, filePath) => {
    if (
      filePath.includes('index.html') ||
      filePath.includes('login.html') ||
      filePath.includes('signup.html')
    ) {
      res.setHeader('Cache-Control', 'no-store');
    }
  }
}));

// Add this route to serve signup.html at root '/'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

//Get all leagues 
app.get('/api/leagues', async (req, res) => {
  try {
    const [leagues] = await db.execute('SELECT id, name FROM leagues');
    res.json(leagues);
  } catch (error) {
    console.error('Error fetching leagues:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Get teams by league
app.get('/api/teams', async (req, res) => {
  const leagueId = req.query.league_id;
  if (!leagueId) {
    return res.status(400).json({ error: 'Missing league_id parameter' });
  }

  try {
    const [teams] = await db.execute('SELECT id, name FROM teams WHERE league_id = ?', [leagueId]);
    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// ✅ Static file middleware with index disabled
app.use(express.static(path.join(__dirname, 'public'), {
  index: false, // disables auto index.html
  setHeaders: (res, filePath) => {
    if (
      filePath.includes('index.html') ||
      filePath.includes('login.html') ||
      filePath.includes('signup.html')
    ) {
      res.setHeader('Cache-Control', 'no-store');
    }
  }
}));




// 6. ✅ SPA Fallback
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });


// 7. ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Unhandled Error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 8. ✅ Database Initialization
async function initializeDatabase() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Database tables verified');
  } catch (err) {
    console.error('❌ Database initialization failed:', err);
    process.exit(1); // Stop the server if DB setup fails
  }
}

// 9. ✅ Server Startup after DB Init
const PORT = process.env.PORT || 3000;

initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Access it at: http://localhost:${PORT}`);
  });
});

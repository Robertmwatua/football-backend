// models/user.js
class User {
  constructor(db) {
    this.db = db;
  }

  async findByUsername(username) {
    const [rows] = await this.db.query(
      'SELECT * FROM users WHERE username = ?', 
      [username]
    );
    return rows[0];
  }

  async create(username, hashedPassword) {
    const [result] = await this.db.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );
    return { id: result.insertId, username };
  }

  async findById(id) {
    const [rows] = await this.db.query(
      'SELECT id, username FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }
}

module.exports = User;
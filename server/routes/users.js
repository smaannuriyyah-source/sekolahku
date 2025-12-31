import express from 'express';
import bcrypt from 'bcryptjs';
import { getDatabaseSync } from '../config/database.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(isAdmin);

// GET /api/users - List all users
router.get('/', (req, res) => {
    try {
        const db = getDatabaseSync();
        const users = db.prepare(`
      SELECT id, username, name, role, created_at, updated_at 
      FROM users 
      ORDER BY created_at DESC
    `).all();

        res.json({ users });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// POST /api/users - Create new Penulis account
router.post('/', (req, res) => {
    try {
        const db = getDatabaseSync();
        const { username, password, name } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username dan password harus diisi' });
        }

        const existingUser = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
        if (existingUser) {
            return res.status(400).json({ error: 'Username sudah digunakan' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const result = db.prepare(`
      INSERT INTO users (username, password, name, role)
      VALUES (?, ?, ?, 'penulis')
    `).run(username, hashedPassword, name || username);

        const newUser = db.prepare('SELECT id, username, name, role, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);

        res.status(201).json({
            message: 'Akun penulis berhasil dibuat',
            user: newUser
        });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// GET /api/users/:id - Get user by ID
router.get('/:id', (req, res) => {
    try {
        const db = getDatabaseSync();
        const user = db.prepare(`
      SELECT id, username, name, role, created_at, updated_at 
      FROM users WHERE id = ?
    `).get(parseInt(req.params.id));

        if (!user) {
            return res.status(404).json({ error: 'User tidak ditemukan' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// PUT /api/users/:id - Update user
router.put('/:id', (req, res) => {
    try {
        const db = getDatabaseSync();
        const { username, password, name, role } = req.body;
        const userId = parseInt(req.params.id);

        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
        if (!user) {
            return res.status(404).json({ error: 'User tidak ditemukan' });
        }

        if (username && username !== user.username) {
            const existingUser = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
            if (existingUser && existingUser.id !== userId) {
                return res.status(400).json({ error: 'Username sudah digunakan' });
            }
        }

        // Build update query
        if (username) {
            db.prepare('UPDATE users SET username = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(username, userId);
        }
        if (password) {
            const hashedPassword = bcrypt.hashSync(password, 10);
            db.prepare('UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(hashedPassword, userId);
        }
        if (name !== undefined) {
            db.prepare('UPDATE users SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(name, userId);
        }
        if (role && ['admin', 'penulis'].includes(role)) {
            db.prepare('UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(role, userId);
        }

        const updatedUser = db.prepare('SELECT id, username, name, role, created_at, updated_at FROM users WHERE id = ?').get(userId);

        res.json({
            message: 'User berhasil diupdate',
            user: updatedUser
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', (req, res) => {
    try {
        const db = getDatabaseSync();
        const userId = parseInt(req.params.id);

        if (userId === req.user.id) {
            return res.status(400).json({ error: 'Tidak dapat menghapus akun sendiri' });
        }

        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
        if (!user) {
            return res.status(404).json({ error: 'User tidak ditemukan' });
        }

        db.prepare('DELETE FROM users WHERE id = ?').run(userId);

        res.json({ message: 'User berhasil dihapus' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

export default router;

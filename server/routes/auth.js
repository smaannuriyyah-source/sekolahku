import express from 'express';
import bcrypt from 'bcryptjs';
import { getDatabaseSync } from '../config/database.js';
import { authenticate, generateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/login - Login user
router.post('/login', (req, res) => {
    try {
        const db = getDatabaseSync();
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username dan password harus diisi' });
        }

        const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

        if (!user) {
            return res.status(401).json({ error: 'Username atau password salah' });
        }

        const isValidPassword = bcrypt.compareSync(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Username atau password salah' });
        }

        const token = generateToken(user);

        res.json({
            message: 'Login berhasil',
            token,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// POST /api/auth/logout - Logout user
router.post('/logout', authenticate, (req, res) => {
    res.json({ message: 'Logout berhasil' });
});

// GET /api/auth/me - Get current user
router.get('/me', authenticate, (req, res) => {
    try {
        const db = getDatabaseSync();
        const user = db.prepare('SELECT id, username, name, role, created_at FROM users WHERE id = ?').get(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User tidak ditemukan' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

export default router;

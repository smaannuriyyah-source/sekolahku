import express from 'express';
import bcrypt from 'bcryptjs';
import { getDatabaseSync } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

// GET /api/profile - Get own profile
router.get('/', (req, res) => {
    try {
        const db = getDatabaseSync();
        const user = db.prepare(`
      SELECT id, username, name, role, created_at, updated_at 
      FROM users WHERE id = ?
    `).get(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User tidak ditemukan' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// PUT /api/profile - Update own profile
router.put('/', (req, res) => {
    try {
        const db = getDatabaseSync();
        const { name, username } = req.body;
        const userId = req.user.id;

        if (username) {
            const existingUser = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
            if (existingUser && existingUser.id !== userId) {
                return res.status(400).json({ error: 'Username sudah digunakan' });
            }
            db.prepare('UPDATE users SET username = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(username, userId);
        }

        if (name !== undefined) {
            db.prepare('UPDATE users SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(name, userId);
        }

        const updatedUser = db.prepare('SELECT id, username, name, role, created_at, updated_at FROM users WHERE id = ?').get(userId);

        res.json({
            message: 'Profile berhasil diupdate',
            user: updatedUser
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// PUT /api/profile/password - Change password
router.put('/password', (req, res) => {
    try {
        const db = getDatabaseSync();
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Password lama dan baru harus diisi' });
        }

        if (newPassword.length < 4) {
            return res.status(400).json({ error: 'Password baru minimal 4 karakter' });
        }

        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);

        if (!bcrypt.compareSync(currentPassword, user.password)) {
            return res.status(400).json({ error: 'Password lama tidak sesuai' });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        db.prepare('UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(hashedPassword, req.user.id);

        res.json({ message: 'Password berhasil diubah' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

export default router;

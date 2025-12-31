import express from 'express';
import { getDatabaseSync } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// POST /api/registrations - Store new registration
router.post('/', (req, res) => {
    try {
        const db = getDatabaseSync();
        const {
            full_name, gender, nisn, birth_place, birth_date,
            nik, religion, father_name, mother_name,
            address, phone_number, origin_school
        } = req.body;

        // Basic validation
        if (!full_name || !gender || !birth_place || !birth_date || !phone_number) {
            return res.status(400).json({ error: 'Mohon lengkapi data wajib (*)' });
        }

        const stmt = db.prepare(`
            INSERT INTO registrations (
                full_name, gender, nisn, birth_place, birth_date,
                nik, religion, father_name, mother_name,
                address, phone_number, origin_school
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            full_name, gender, nisn || '', birth_place, birth_date,
            nik || '', religion, father_name, mother_name,
            address, phone_number, origin_school
        );

        res.status(201).json({ message: 'Pendaftaran berhasil dikirim!' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server saat menyimpan data' });
    }
});

// GET /api/registrations/stats - Get count of registrations (Protected)
router.get('/stats', authenticate, (req, res) => {
    try {
        const db = getDatabaseSync();
        const result = db.prepare('SELECT count(*) as count FROM registrations').get();
        res.json({ count: result.count });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Gagal mengambil statistik' });
    }
});

// GET /api/registrations - List all registrations (Protected)
router.get('/', authenticate, (req, res) => {
    try {
        const db = getDatabaseSync();
        const registrations = db.prepare('SELECT * FROM registrations ORDER BY created_at DESC').all();
        res.json({ registrations });
    } catch (error) {
        console.error('List registrations error:', error);
        res.status(500).json({ error: 'Gagal mengambil data pendaftar' });
    }
});

// DELETE /api/registrations/:id - Delete a registration (Protected)
router.delete('/:id', authenticate, (req, res) => {
    try {
        const db = getDatabaseSync();
        const { id } = req.params;

        const stmt = db.prepare('DELETE FROM registrations WHERE id = ?');
        const result = stmt.run(id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Data pendaftar tidak ditemukan' });
        }

        res.json({ message: 'Data pendaftar berhasil dihapus' });
    } catch (error) {
        console.error('Delete registration error:', error);
        res.status(500).json({ error: 'Gagal menghapus data pendaftar' });
    }
});

export default router;

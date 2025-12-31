import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDatabaseSync } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.use(authenticate);

// GET /api/reports - List all reports
router.get('/', (req, res) => {
    try {
        const db = getDatabaseSync();
        const { author_id } = req.query;

        let reports = db.prepare(`
      SELECT 
        r.*,
        u.name as author_name,
        u.username as author_username
      FROM reports r
      LEFT JOIN users u ON r.author_id = u.id
      ORDER BY r.created_at DESC
    `).all();

        if (author_id) {
            reports = reports.filter(r => r.author_id === parseInt(author_id));
        }

        res.json({ reports });
    } catch (error) {
        console.error('Get reports error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// POST /api/reports - Create report with photo upload
router.post('/', upload.single('photo'), (req, res) => {
    try {
        const db = getDatabaseSync();
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Judul laporan harus diisi' });
        }

        const photoPath = req.file ? `/uploads/${req.file.filename}` : null;

        const result = db.prepare('INSERT INTO reports (title, photo, author_id) VALUES (?, ?, ?)').run(title, photoPath, req.user.id);

        const report = db.prepare(`
      SELECT 
        r.*,
        u.name as author_name,
        u.username as author_username
      FROM reports r
      LEFT JOIN users u ON r.author_id = u.id
      WHERE r.id = ?
    `).get(result.lastInsertRowid);

        res.status(201).json({
            message: 'Laporan berhasil dibuat',
            report
        });
    } catch (error) {
        console.error('Create report error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// GET /api/reports/:id - Get report by ID
router.get('/:id', (req, res) => {
    try {
        const db = getDatabaseSync();
        const report = db.prepare(`
      SELECT 
        r.*,
        u.name as author_name,
        u.username as author_username
      FROM reports r
      LEFT JOIN users u ON r.author_id = u.id
      WHERE r.id = ?
    `).get(parseInt(req.params.id));

        if (!report) {
            return res.status(404).json({ error: 'Laporan tidak ditemukan' });
        }

        res.json({ report });
    } catch (error) {
        console.error('Get report error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// PUT /api/reports/:id - Update report (Author or Admin)
router.put('/:id', upload.single('photo'), (req, res) => {
    try {
        const db = getDatabaseSync();
        const { title } = req.body;
        const reportId = parseInt(req.params.id);

        const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(reportId);
        if (!report) {
            return res.status(404).json({ error: 'Laporan tidak ditemukan' });
        }

        if (report.author_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Tidak memiliki izin untuk mengubah laporan ini' });
        }

        if (title) {
            db.prepare('UPDATE reports SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(title, reportId);
        }

        if (req.file) {
            // Delete old photo if exists
            if (report.photo) {
                const oldPhotoPath = path.join(__dirname, '..', report.photo);
                if (fs.existsSync(oldPhotoPath)) {
                    fs.unlinkSync(oldPhotoPath);
                }
            }
            db.prepare('UPDATE reports SET photo = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(`/uploads/${req.file.filename}`, reportId);
        }

        const updatedReport = db.prepare(`
      SELECT 
        r.*,
        u.name as author_name,
        u.username as author_username
      FROM reports r
      LEFT JOIN users u ON r.author_id = u.id
      WHERE r.id = ?
    `).get(reportId);

        res.json({
            message: 'Laporan berhasil diupdate',
            report: updatedReport
        });
    } catch (error) {
        console.error('Update report error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// DELETE /api/reports/:id - Delete report (Author or Admin)
router.delete('/:id', (req, res) => {
    try {
        const db = getDatabaseSync();
        const reportId = parseInt(req.params.id);

        const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(reportId);
        if (!report) {
            return res.status(404).json({ error: 'Laporan tidak ditemukan' });
        }

        if (report.author_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Tidak memiliki izin untuk menghapus laporan ini' });
        }

        // Delete photo file if exists
        if (report.photo) {
            const photoPath = path.join(__dirname, '..', report.photo);
            if (fs.existsSync(photoPath)) {
                fs.unlinkSync(photoPath);
            }
        }

        db.prepare('DELETE FROM reports WHERE id = ?').run(reportId);

        res.json({ message: 'Laporan berhasil dihapus' });
    } catch (error) {
        console.error('Delete report error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

export default router;

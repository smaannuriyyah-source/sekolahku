import express from 'express';
import { getDatabaseSync } from '../config/database.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

// GET /api/categories - List all categories
router.get('/', (req, res) => {
    try {
        const db = getDatabaseSync();
        const categories = db.prepare('SELECT * FROM categories ORDER BY created_at DESC').all();
        res.json({ categories });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// POST /api/categories - Create category (Admin only)
router.post('/', isAdmin, (req, res) => {
    try {
        const db = getDatabaseSync();
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Nama kategori harus diisi' });
        }

        const result = db.prepare('INSERT INTO categories (name, description) VALUES (?, ?)').run(name, description || null);
        const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);

        res.status(201).json({
            message: 'Kategori berhasil dibuat',
            category
        });
    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// GET /api/categories/:id - Get category by ID
router.get('/:id', (req, res) => {
    try {
        const db = getDatabaseSync();
        const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(parseInt(req.params.id));

        if (!category) {
            return res.status(404).json({ error: 'Kategori tidak ditemukan' });
        }

        res.json({ category });
    } catch (error) {
        console.error('Get category error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// PUT /api/categories/:id - Update category (Admin only)
router.put('/:id', isAdmin, (req, res) => {
    try {
        const db = getDatabaseSync();
        const { name, description } = req.body;
        const categoryId = parseInt(req.params.id);

        const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(categoryId);
        if (!category) {
            return res.status(404).json({ error: 'Kategori tidak ditemukan' });
        }

        if (name) {
            db.prepare('UPDATE categories SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(name, categoryId);
        }
        if (description !== undefined) {
            db.prepare('UPDATE categories SET description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(description, categoryId);
        }

        const updatedCategory = db.prepare('SELECT * FROM categories WHERE id = ?').get(categoryId);

        res.json({
            message: 'Kategori berhasil diupdate',
            category: updatedCategory
        });
    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// DELETE /api/categories/:id - Delete category (Admin only)
router.delete('/:id', isAdmin, (req, res) => {
    try {
        const db = getDatabaseSync();
        const categoryId = parseInt(req.params.id);

        const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(categoryId);
        if (!category) {
            return res.status(404).json({ error: 'Kategori tidak ditemukan' });
        }

        db.prepare('DELETE FROM categories WHERE id = ?').run(categoryId);

        res.json({ message: 'Kategori berhasil dihapus' });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

export default router;

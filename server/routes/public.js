import express from 'express';
import { getDatabaseSync } from '../config/database.js';

const router = express.Router();

// GET /api/public/articles - List published articles (no auth required)
router.get('/articles', (req, res) => {
    try {
        const db = getDatabaseSync();
        const { category_id, page = 1, limit = 9, search } = req.query;

        const offset = (page - 1) * limit;

        let query = `
            SELECT 
                a.*,
                u.name as author_name,
                c.name as category_name
            FROM articles a
            LEFT JOIN users u ON a.author_id = u.id
            LEFT JOIN categories c ON a.category_id = c.id
            WHERE a.status = 'published'
        `;

        let countQuery = `SELECT COUNT(*) as total FROM articles a WHERE a.status = 'published'`;
        const params = [];

        if (category_id) {
            query += ` AND a.category_id = ?`;
            countQuery += ` AND a.category_id = ?`;
            params.push(parseInt(category_id));
        }

        if (search) {
            query += ` AND (a.title LIKE ? OR a.content LIKE ?)`;
            countQuery += ` AND (a.title LIKE ? OR a.content LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`);
        }

        const totalResult = db.prepare(countQuery).get(...params);
        const total = totalResult ? totalResult.total : 0;

        query += ` ORDER BY a.created_at DESC LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), parseInt(offset));

        const articles = db.prepare(query).all(...params);

        res.json({
            articles,
            meta: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get public articles error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// GET /api/public/articles/:id - Get single published article
router.get('/articles/:id', (req, res) => {
    try {
        const db = getDatabaseSync();
        const article = db.prepare(`
            SELECT 
                a.*,
                u.name as author_name,
                c.name as category_name
            FROM articles a
            LEFT JOIN users u ON a.author_id = u.id
            LEFT JOIN categories c ON a.category_id = c.id
            WHERE a.id = ? AND a.status = 'published'
        `).get(parseInt(req.params.id));

        if (!article) {
            return res.status(404).json({ error: 'Artikel tidak ditemukan' });
        }

        res.json({ article });
    } catch (error) {
        console.error('Get public article error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// GET /api/public/categories - List all categories (no auth required)
router.get('/categories', (req, res) => {
    try {
        const db = getDatabaseSync();
        const categories = db.prepare('SELECT * FROM categories ORDER BY name ASC').all();
        res.json({ categories });
    } catch (error) {
        console.error('Get public categories error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

export default router;

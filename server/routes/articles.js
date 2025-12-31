import express from 'express';
import { getDatabaseSync } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

// GET /api/articles - List all articles with pagination and filtering
router.get('/', (req, res) => {
    try {
        const db = getDatabaseSync();
        const { status, category_id, author_id, page = 1, limit = 9, search } = req.query;

        const offset = (page - 1) * limit;

        // Base Query construction
        let query = `
            SELECT 
                a.*,
                u.name as author_name,
                u.username as author_username,
                c.name as category_name
            FROM articles a
            LEFT JOIN users u ON a.author_id = u.id
            LEFT JOIN categories c ON a.category_id = c.id
            WHERE 1=1
        `;

        let countQuery = `SELECT COUNT(*) as total FROM articles a WHERE 1=1`;
        const params = [];

        // Dynamic Filters
        if (status) {
            query += ` AND a.status = ?`;
            countQuery += ` AND a.status = ?`;
            params.push(status);
        }

        if (category_id) {
            query += ` AND a.category_id = ?`;
            countQuery += ` AND a.category_id = ?`;
            params.push(parseInt(category_id));
        }

        if (author_id) {
            query += ` AND a.author_id = ?`;
            countQuery += ` AND a.author_id = ?`;
            params.push(parseInt(author_id));
        }

        if (search) {
            query += ` AND (a.title LIKE ? OR a.content LIKE ?)`;
            countQuery += ` AND (a.title LIKE ? OR a.content LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`);
        }

        // Get Total Count
        const totalResult = db.prepare(countQuery).get(...params);
        const total = totalResult ? totalResult.total : 0;

        // Add Order and Pagination
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
        console.error('Get articles error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// POST /api/articles - Create article
router.post('/', (req, res) => {
    try {
        const db = getDatabaseSync();
        const { title, content, category_id, status, thumbnail } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Judul artikel harus diisi' });
        }

        const result = db.prepare(`
      INSERT INTO articles (title, content, thumbnail, category_id, author_id, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(title, content || null, thumbnail || null, category_id || null, req.user.id, status || 'draft');

        const article = db.prepare(`
      SELECT 
        a.*,
        u.name as author_name,
        u.username as author_username,
        c.name as category_name
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.id = ?
    `).get(result.lastInsertRowid);

        res.status(201).json({
            message: 'Artikel berhasil dibuat',
            article
        });
    } catch (error) {
        console.error('Create article error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// GET /api/articles/:id - Get article by ID
router.get('/:id', (req, res) => {
    try {
        const db = getDatabaseSync();
        const article = db.prepare(`
      SELECT 
        a.*,
        u.name as author_name,
        u.username as author_username,
        c.name as category_name
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.id = ?
    `).get(parseInt(req.params.id));

        if (!article) {
            return res.status(404).json({ error: 'Artikel tidak ditemukan' });
        }

        res.json({ article });
    } catch (error) {
        console.error('Get article error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// PUT /api/articles/:id - Update article (Author or Admin)
router.put('/:id', (req, res) => {
    try {
        const db = getDatabaseSync();
        const { title, content, category_id, status, thumbnail } = req.body;
        const articleId = parseInt(req.params.id);

        const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(articleId);
        if (!article) {
            return res.status(404).json({ error: 'Artikel tidak ditemukan' });
        }

        if (article.author_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Tidak memiliki izin untuk mengubah artikel ini' });
        }

        if (title) {
            db.prepare('UPDATE articles SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(title, articleId);
        }
        if (content !== undefined) {
            db.prepare('UPDATE articles SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(content, articleId);
        }
        if (thumbnail !== undefined) {
            db.prepare('UPDATE articles SET thumbnail = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(thumbnail, articleId);
        }
        if (category_id !== undefined) {
            db.prepare('UPDATE articles SET category_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(category_id, articleId);
        }
        if (status && ['draft', 'published'].includes(status)) {
            db.prepare('UPDATE articles SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, articleId);
        }

        const updatedArticle = db.prepare(`
      SELECT 
        a.*,
        u.name as author_name,
        u.username as author_username,
        c.name as category_name
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.id = ?
    `).get(articleId);

        res.json({
            message: 'Artikel berhasil diupdate',
            article: updatedArticle
        });
    } catch (error) {
        console.error('Update article error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// DELETE /api/articles/:id - Delete article (Author or Admin)
router.delete('/:id', (req, res) => {
    try {
        const db = getDatabaseSync();
        const articleId = parseInt(req.params.id);

        const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(articleId);
        if (!article) {
            return res.status(404).json({ error: 'Artikel tidak ditemukan' });
        }

        if (article.author_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Tidak memiliki izin untuk menghapus artikel ini' });
        }

        db.prepare('DELETE FROM articles WHERE id = ?').run(articleId);

        res.json({ message: 'Artikel berhasil dihapus' });
    } catch (error) {
        console.error('Delete article error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

export default router;

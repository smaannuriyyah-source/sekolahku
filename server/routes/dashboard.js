import express from 'express';
import { getDatabaseSync } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', authenticate, (req, res) => {
    try {
        const db = getDatabaseSync();

        // Get total reports count
        const reportsCount = db.prepare('SELECT COUNT(*) as count FROM reports').get();

        // Get total articles count
        const articlesCount = db.prepare('SELECT COUNT(*) as count FROM articles WHERE status = ?').get('published');

        // Get total users count
        const usersCount = db.prepare('SELECT COUNT(*) as count FROM users').get();

        // Get recent articles (last 5)
        const recentArticles = db.prepare(`
            SELECT id, title, slug, status, created_at 
            FROM articles 
            ORDER BY created_at DESC 
            LIMIT 5
        `).all();

        // Get recent reports (last 5)
        const recentReports = db.prepare(`
            SELECT id, name, email, created_at 
            FROM reports 
            ORDER BY created_at DESC 
            LIMIT 5
        `).all();

        res.json({
            stats: {
                totalReports: reportsCount.count,
                totalArticles: articlesCount.count,
                totalUsers: usersCount.count,
                visitors: Math.floor(Math.random() * 1000) + 500 // Placeholder for now
            },
            recentArticles,
            recentReports
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

export default router;

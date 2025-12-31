import express from 'express';
import { upload } from '../middleware/upload.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// POST /api/upload - Upload single image (authenticated)
router.post('/', authenticate, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Tidak ada file yang diupload' });
        }

        const imageUrl = `/uploads/${req.file.filename}`;

        res.json({
            message: 'Gambar berhasil diupload',
            url: imageUrl,
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Gagal mengupload gambar' });
    }
});

export default router;

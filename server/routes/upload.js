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

        // Cloudinary returns path property, local storage uses filename
        let imageUrl;
        if (req.file.path && req.file.path.startsWith('http')) {
            // Cloudinary URL
            imageUrl = req.file.path;
        } else {
            // Local file path
            imageUrl = `/uploads/${req.file.filename}`;
        }

        res.json({
            message: 'Gambar berhasil diupload',
            url: imageUrl,
            filename: req.file.filename || req.file.public_id,
            originalName: req.file.originalname,
            size: req.file.size
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Gagal mengupload gambar' });
    }
});

export default router;

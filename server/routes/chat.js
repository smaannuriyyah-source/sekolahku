import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getRAGContext, loadAllDocuments } from '../services/ragService.js';

const router = express.Router();

// Preload RAG documents at startup
loadAllDocuments();

const SCHOOL_CONTEXT = `
Kamu adalah Nuri, asisten AI SMA An-Nuriyyah Bumiayu.

⚡ ATURAN UTAMA - JAWABAN SINGKAT:
- Jawab dalam 1-3 kalimat saja (bisa dibaca dalam 5 detik)
- Langsung ke inti jawaban, jangan bertele-tele
- Tetap ramah dan profesional
- Gunakan format: Sapaan singkat + Jawaban inti + (opsional) tawaran bantuan

📝 CONTOH JAWABAN IDEAL:
User: "Berapa biaya pendaftaran?"
Nuri: "Halo Kak! Total biaya pendaftaran Rp 1.200.000 sudah termasuk seragam, tes, dan SPP Juli. Ada yang ingin ditanyakan lagi?"

User: "Kapan pendaftaran dibuka?"
Nuri: "Pendaftaran SPMB dibuka Desember 2025 - Juni 2026, Kak. Kuota terbatas 200 siswa ya!"

⚠️ JIKA TIDAK TAHU:
Jawab singkat: "Maaf Kak, untuk info lebih detail silakan hubungi Admin ya: [Hubungi Admin via WhatsApp](https://wa.me/628812945090)"

🚫 HINDARI:
- Jawaban panjang lebar
- Mengulang pertanyaan user
- Penjelasan berbelit-belit
- Emoji berlebihan (max 1-2)
`;


// POST /api/chat - Send message to Gemini AI
router.post('/', async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Pesan tidak boleh kosong' });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        console.log('Chat request received, message:', message.substring(0, 50) + '...');
        console.log('GEMINI_API_KEY exists:', !!apiKey, 'Length:', apiKey ? apiKey.length : 0);

        if (!apiKey) {
            console.error('GEMINI_API_KEY is not set in environment variables');
            return res.status(500).json({
                error: 'AI service tidak tersedia',
                response: 'Maaf, saat ini saya sedang mengalami gangguan koneksi. Silakan coba lagi nanti.'
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        console.log('Using model: gemini-2.5-flash');

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: SCHOOL_CONTEXT }],
                },
                {
                    role: "model",
                    parts: [{ text: "Baik, saya mengerti. Saya adalah Nuri, asisten AI SMA Annuriyyah Bumiayu. Saya siap membantu menjawab pertanyaan seputar sekolah dengan ramah dan akurat. Jika ada informasi yang saya tidak tahu atau ragu, saya akan mengarahkan pengguna untuk menghubungi Admin via WhatsApp di link ini: [Hubungi Admin via WhatsApp](https://wa.me/628812945090)." }],
                },
                ...(history || [])
            ],
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        // Get relevant context from RAG
        const ragContext = getRAGContext(message);
        console.log('RAG context found:', ragContext ? 'Yes' : 'No');

        // Combine message with RAG context
        const enhancedMessage = ragContext
            ? `${ragContext}\n\nPERTANYAAN PENGGUNA: ${message}`
            : message;

        const result = await chat.sendMessage(enhancedMessage);
        const response = await result.response;
        const responseText = response.text();

        res.json({
            success: true,
            response: responseText
        });
    } catch (error) {
        console.error('Error calling Gemini API:', error.message);
        console.error('Full error stack:', error.stack);
        res.status(500).json({
            error: 'Gagal memproses pesan',
            response: 'Maaf, saat ini saya sedang mengalami gangguan koneksi. Silakan coba lagi nanti.',
            errorMessage: error.message
        });
    }
});

export default router;

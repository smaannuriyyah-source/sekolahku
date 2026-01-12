import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to RAG data folder
const RAG_DATA_PATH = path.join(__dirname, '../rag-data');

// Cache for loaded documents
let documentsCache = null;

/**
 * Load all .txt files from the rag-data folder
 * @returns {Array} Array of documents with filename and content
 */
export function loadAllDocuments() {
    if (documentsCache) {
        return documentsCache;
    }

    try {
        const files = fs.readdirSync(RAG_DATA_PATH);
        const documents = [];

        for (const file of files) {
            if (file.endsWith('.txt')) {
                const filePath = path.join(RAG_DATA_PATH, file);
                const content = fs.readFileSync(filePath, 'utf-8');

                // Extract topic from filename (e.g., "01_profil_sekolah.txt" -> "profil sekolah")
                const topic = file
                    .replace(/^\d+_/, '') // Remove number prefix
                    .replace('.txt', '')  // Remove extension
                    .replace(/_/g, ' ');  // Replace underscores with spaces

                documents.push({
                    filename: file,
                    topic: topic,
                    content: content.trim()
                });
            }
        }

        documentsCache = documents;
        console.log(`RAG: Loaded ${documents.length} documents`);
        return documents;
    } catch (error) {
        console.error('Error loading RAG documents:', error);
        return [];
    }
}

/**
 * Search documents based on keywords in the query
 * @param {string} query - User's question
 * @returns {Array} Relevant documents
 */
export function searchDocuments(query) {
    const documents = loadAllDocuments();
    const queryLower = query.toLowerCase();

    // Define keyword mappings for better search
    const keywordMappings = {
        'profil': ['profil', 'sekolah', 'tentang', 'sejarah', 'pendiri', 'berdiri'],
        'visi': ['visi', 'misi', 'tujuan', 'ulil albab'],
        'pendaftaran': ['pendaftaran', 'daftar', 'ppdb', 'spmb', 'syarat', 'persyaratan', 'cara daftar', 'mendaftar'],
        'biaya': ['biaya', 'uang', 'bayar', 'spp', 'harga', 'tarif', 'rincian', 'total', 'berapa'],
        'fasilitas': ['fasilitas', 'lab', 'laboratorium', 'komputer', 'perpustakaan', 'aula', 'wifi', 'hotspot', 'kelas', 'pondok', 'pesantren', 'asrama'],
        'ekstrakurikuler': ['ekskul', 'ekstrakurikuler', 'pramuka', 'paskibra', 'futsal', 'voli', 'hadroh', 'pmr', 'btq', 'tari', 'bahasa inggris'],
        'program': ['program', 'unggulan', 'mabit', 'sabsah', 'btq'],
        'beasiswa': ['beasiswa', 'ranking', 'gratis', 'diskon', 'yatim', 'bantuan', 'tidak mampu'],
        'kontak': ['kontak', 'hubungi', 'telepon', 'hp', 'whatsapp', 'wa', 'alamat', 'lokasi', 'dimana', 'instagram', 'sosial media']
    };

    // Find relevant topics based on query
    const relevantTopics = new Set();

    for (const [topic, keywords] of Object.entries(keywordMappings)) {
        for (const keyword of keywords) {
            if (queryLower.includes(keyword)) {
                relevantTopics.add(topic);
            }
        }
    }

    // If no specific topic found, search all documents for matching content
    if (relevantTopics.size === 0) {
        // Return all documents as context (or limit to most relevant)
        return documents.slice(0, 3); // Return first 3 documents as default
    }

    // Filter documents based on relevant topics
    const relevantDocs = documents.filter(doc => {
        const topicLower = doc.topic.toLowerCase();
        for (const topic of relevantTopics) {
            if (topicLower.includes(topic)) {
                return true;
            }
        }
        // Also check if content contains query words
        return relevantTopics.size > 0 && doc.content.toLowerCase().includes(queryLower.split(' ')[0]);
    });

    // If still no matches, do a broader search
    if (relevantDocs.length === 0) {
        return documents.filter(doc => {
            const words = queryLower.split(' ').filter(w => w.length > 2);
            return words.some(word =>
                doc.content.toLowerCase().includes(word) ||
                doc.topic.toLowerCase().includes(word)
            );
        }).slice(0, 3);
    }

    return relevantDocs;
}

/**
 * Get context for Gemini based on user query
 * @param {string} query - User's question
 * @returns {string} Combined context from relevant documents
 */
export function getRAGContext(query) {
    const relevantDocs = searchDocuments(query);

    if (relevantDocs.length === 0) {
        return '';
    }

    const context = relevantDocs.map(doc => {
        return `=== ${doc.topic.toUpperCase()} ===\n${doc.content}`;
    }).join('\n\n');

    return `
INFORMASI REFERENSI DARI DATABASE SEKOLAH:
${context}

Gunakan informasi di atas untuk menjawab pertanyaan pengguna. Jika informasi yang dibutuhkan tidak ada dalam referensi, katakan dengan sopan bahwa kamu tidak memiliki informasi tersebut dan arahkan ke Admin WhatsApp.
`;
}

/**
 * Reload documents cache (useful when files are updated)
 */
export function reloadDocuments() {
    documentsCache = null;
    return loadAllDocuments();
}

export default {
    loadAllDocuments,
    searchDocuments,
    getRAGContext,
    reloadDocuments
};

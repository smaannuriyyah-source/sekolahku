// AI Service - Uses backend API for secure Gemini integration

const API_URL = import.meta.env.VITE_API_URL || '';

export const getGeminiResponse = async (history, message) => {
    try {
        const response = await fetch(`${API_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message,
                history
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to get response from AI');
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error("Error calling AI API:", error);
        return "Maaf, saat ini saya sedang mengalami gangguan koneksi. Silakan coba lagi nanti.";
    }
};

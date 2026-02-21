/**
 * generator/core/normalization.js
 */
const Normalization = {
    normalizeText: (text) => {
        if (!text) return '';
        return text.toString().trim();
    },
    normalizeWhatsApp: (phone) => {
        if (!phone) return '';
        let cleaned = phone.toString().replace(/\D/g, '');
        if (cleaned.length === 10 || cleaned.length === 11) {
            cleaned = '55' + cleaned;
        }
        return cleaned;
    },
    normalizeUrl: (url) => {
        if (!url) return '';
        let cleaned = url.trim();
        if (!/^https?:\/\//i.test(cleaned)) {
            cleaned = 'https://' + cleaned;
        }
        return cleaned;
    }
};

if (typeof module !== 'undefined') {
    module.exports = Normalization;
} else {
    window.Normalization = Normalization;
}

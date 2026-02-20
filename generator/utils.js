/**
 * Generator/Utils.js
 * Utilitários para o sistema Pagina Express.
 */

/**
 * Transforma texto em slug de URL (minúsculo, sem acentos, sem espaços)
 * @param {string} text 
 * @returns {string}
 */
function slugify(text) {
    if (!text) return '';
    return text.toString().toLowerCase().trim()
        .normalize('NFD') // Normaliza para decompor acentos
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^a-z0-9 -]/g, '') // Remove caracteres especiais
        .replace(/\s+/g, '-') // Espaços para hífens
        .replace(/-+/g, '-') // Remove hífens duplicados
        .replace(/^-+/, '') // Remove hífens no início
        .replace(/-+$/, ''); // Remove hífens no final
}

if (typeof module !== 'undefined') {
    module.exports = { slugify };
}

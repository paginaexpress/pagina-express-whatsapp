/**
 * Generator/Slugify.js
 * Transforma nomes de empresas em slugs de URL.
 */
function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

if (typeof module !== 'undefined') {
    module.exports = { slugify };
}

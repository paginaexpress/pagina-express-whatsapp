const fs = require('fs');
const path = require('path');

/**
 * Gera um arquivo sitemap.xml baseado nos clientes ativos
 */
function generateSitemap() {
    console.log(`\n--- Gerando Sitemap Atomático ---`);

    const CLIENTS_PATH = path.join(__dirname, '../data/clients.json');
    const SITEMAP_PATH = path.join(__dirname, '../sitemap.xml');
    const BASE_URL = "https://pagina-express.pages.dev";

    if (!fs.existsSync(CLIENTS_PATH)) return;

    const clients = JSON.parse(fs.readFileSync(CLIENTS_PATH, 'utf-8'));

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // URL Principal
    xml += `  <url>\n    <loc>${BASE_URL}/</loc>\n    <priority>1.0</priority>\n  </url>\n`;

    // URLs dos Clientes
    clients.forEach(client => {
        xml += `  <url>\n`;
        xml += `    <loc>${client.url_final}</loc>\n`;
        xml += `    <lastmod>${client.data_criacao.split('T')[0]}</lastmod>\n`;
        xml += `    <priority>0.8</priority>\n`;
        xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    fs.writeFileSync(SITEMAP_PATH, xml, 'utf-8');
    console.log(`✔ sitemap.xml atualizado com ${clients.length} páginas.`);
}

module.exports = { generateSitemap };

if (require.main === module) {
    generateSitemap();
}

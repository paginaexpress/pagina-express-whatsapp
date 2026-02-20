/**
 * Generator/Apply-Data.js
 * Motor de substituição de variáveis para o template.
 */

/**
 * Injeta dados do cliente no HTML do template.
 * @param {string} templateHTML 
 * @param {object} clientData 
 * @returns {string}
 */
function applyData(templateHTML, clientData) {
    let finalHTML = templateHTML;

    // 1. Substituição de campos simples
    const fields = [
        'nome_empresa', 'descricao', 'whatsapp',
        'cor_primaria', 'instagram', 'facebook'
    ];

    fields.forEach(field => {
        const value = clientData[field] || '';
        const regex = new RegExp(`{{${field}}}`, 'g');
        finalHTML = finalHTML.replace(regex, value);
    });

    // 2. Substituição de Imagens (até 6)
    for (let i = 1; i <= 6; i++) {
        const value = clientData.imagens && clientData.imagens[i - 1] ? clientData.imagens[i - 1] : '';
        const regex = new RegExp(`{{imagem_${i}}}`, 'g');
        finalHTML = finalHTML.replace(regex, value);
    }

    // 3. Substituição de Serviços (até 8)
    for (let i = 1; i <= 8; i++) {
        const value = clientData.servicos && clientData.servicos[i - 1] ? clientData.servicos[i - 1] : '';
        const regex = new RegExp(`{{servico_${i}}}`, 'g');
        finalHTML = finalHTML.replace(regex, value);
    }

    // 3. Limpeza Final (Audit Fix - SEO)
    // Remove qualquer tag {{variavel}} que não tenha sido preenchida (incluindo espaços extras)
    finalHTML = finalHTML.replace(/\{\{\s*[a-zA-Z0-9_-]+\s*\}\}/g, '');

    return finalHTML;
}

if (typeof module !== 'undefined') {
    module.exports = { applyData };
}

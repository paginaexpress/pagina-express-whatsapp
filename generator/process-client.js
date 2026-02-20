/**
 * Generator/Process-Client.js
 * Valida e normaliza o JSON vindo do formulário.
 */

const fs = require('fs');
const { buildPage } = require('./build-page');

/**
 * Processa o JSON do cliente e gera a página.
 * @param {string} jsonPath 
 * @returns {object|null}
 */
function processClient(jsonPath) {
    try {
        if (!fs.existsSync(jsonPath)) {
            throw new Error(`JSON não encontrado em: ${jsonPath}`);
        }

        const rawData = fs.readFileSync(jsonPath, 'utf-8');
        const clientData = JSON.parse(rawData);

        // Validação básica
        const requiredFields = ['nome_empresa', 'whatsapp', 'descricao', 'nicho'];
        for (const field of requiredFields) {
            if (!clientData[field]) {
                throw new Error(`Campo obrigatório ausente: ${field}`);
            }
        }

        // Normalização
        clientData.whatsapp = clientData.whatsapp.replace(/\D/g, ''); // Apenas números
        if (!clientData.whatsapp.startsWith('55') && clientData.whatsapp.length <= 11) {
            clientData.whatsapp = '55' + clientData.whatsapp;
        }

        // Gerar página
        const slug = buildPage(clientData);

        if (!slug) throw new Error("Falha ao gerar página.");

        return { ...clientData, slug };
    } catch (error) {
        console.error(`✖ Erro ao processar cliente: ${error.message}`);
        return null;
    }
}

if (typeof module !== 'undefined') {
    module.exports = { processClient };
}

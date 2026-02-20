/**
 * Generator/Send-Link.js
 * Gerador de mensagens de entrega para o sistema.
 */

/**
 * Monta a mensagem final de entrega.
 * @param {string} cliente 
 * @param {string} url 
 * @returns {string}
 */
function montarMensagem(cliente, url) {
    return `Pronto! Sua página já está no ar 🚀
Aqui está seu link:
${url}

Você já pode divulgar no WhatsApp, Instagram e Google.

Qualquer dúvida é só responder aqui.`;
}

/**
 * Gera os metadados de entrega.
 * @param {object} clientData 
 * @param {string} url 
 * @returns {object}
 */
function sendLink(clientData, url) {
    const mensagem = montarMensagem(clientData.nome_empresa, url);
    const waLink = `https://wa.me/${clientData.whatsapp}?text=${encodeURIComponent(mensagem)}`;

    return {
        url: url,
        whatsapp_link: waLink,
        mensagem_limpa: mensagem
    };
}

if (typeof module !== 'undefined') {
    module.exports = { sendLink, montarMensagem };
}

/**
 * Delivery.js - Pagina Express
 * Lógica da tela de sucesso para entrega da URL.
 */

// 1. Capturar parâmetros da URL
const params = new URLSearchParams(window.location.search);
const clientName = params.get('nome') || 'Cliente';
const finalUrl = params.get('url') || '';
const clientWa = params.get('whatsapp') || '';

const urlDisplay = document.getElementById('urlDisplay');
const copyBtn = document.getElementById('copyBtn');
const waBtn = document.getElementById('waBtn');

if (finalUrl) {
    urlDisplay.innerText = finalUrl;
}

// 2. Lógica de Copiar Link
copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(finalUrl).then(() => {
        copyBtn.innerText = '✔ Link Copiado!';
        setTimeout(() => copyBtn.innerText = 'Copiar Link', 2000);
    });
});

// 3. Lógica de WhatsApp (Mensagem pronta)
if (finalUrl && clientWa) {
    const message = `Pronto! Sua página já está no ar 🚀\n\nAqui está seu link:\n${finalUrl}\n\nVocê já pode divulgar no WhatsApp, Instagram e Google.`;
    const waLink = `https://wa.me/${clientWa}?text=${encodeURIComponent(message)}`;
    waBtn.href = waLink;
} else {
    waBtn.style.display = 'none';
}

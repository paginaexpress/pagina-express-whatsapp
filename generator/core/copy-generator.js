/**
 * generator/core/copy-generator.js
 */
const CopyGenerator = {
    generateCopy: (data) => {
        const { nome_empresa, nicho, publico_alvo, cidade, servico_principal, diferencial } = data;
        const headline = `${servico_principal} para ${publico_alvo} em ${cidade}`;
        const subheadline = `${diferencial} com atendimento direto pelo WhatsApp.`;
        const sobre_texto = `Somos especializados em ${servico_principal}, atendendo clientes que buscam ${diferencial} em ${cidade}.`;

        return {
            headline,
            subheadline,
            sobre_texto
        };
    }
};

if (typeof module !== 'undefined') {
    module.exports = CopyGenerator;
} else {
    window.CopyGenerator = CopyGenerator;
}

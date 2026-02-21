/**
 * generator/core/json-generator.js
 */
const JsonGenerator = {
    assembleJson: (rawData) => {
        const norm = typeof Normalization !== 'undefined' ? Normalization : require('./normalization');
        const copyGen = typeof CopyGenerator !== 'undefined' ? CopyGenerator : require('./copy-generator');
        const colorGen = typeof ColorGenerator !== 'undefined' ? ColorGenerator : require('./color-generator');

        const ident = {
            nome_empresa: norm.normalizeText(rawData.nome_empresa),
            nicho: rawData.nicho,
            publico_alvo: rawData.publico_alvo,
            cidade: norm.normalizeText(rawData.cidade)
        };

        const core = {
            servico_principal: norm.normalizeText(rawData.servico_principal),
            diferencial: norm.normalizeText(rawData.diferencial),
            lista_servicos: (rawData.servicos || []).map(norm.normalizeText)
        };

        const copy = copyGen.generateCopy({ ...ident, ...core });
        const visual = {
            palette: colorGen.generatePalette(rawData.cor_manual),
            logo: rawData.upload_logo || ''
        };

        const contato = {
            whatsapp: norm.normalizeWhatsApp(rawData.whatsapp),
            whatsapp_display: rawData.whatsapp,
            instagram: norm.normalizeUrl(rawData.instagram),
            facebook: norm.normalizeUrl(rawData.facebook)
        };

        return {
            identidade: ident,
            servicos: core,
            copy: copy,
            visual: visual,
            contato: contato,
            midia: {
                fotos: rawData.imagens || []
            },
            seo: {
                title: `${copy.headline} | ${ident.nome_empresa}`,
                description: copy.sobre_texto
            }
        };
    }
};

if (typeof module !== 'undefined') {
    module.exports = JsonGenerator;
} else {
    window.JsonGenerator = JsonGenerator;
}

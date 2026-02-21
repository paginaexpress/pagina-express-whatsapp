/**
 * generator/core/builder.js
 */
const Builder = {
    buildHtml: (templateHTML, finalJson) => {
        let html = templateHTML;

        const mappings = {
            '{{seo_title}}': finalJson.seo.title,
            '{{seo_description}}': finalJson.seo.description,
            '{{color_primary}}': finalJson.visual.palette.primary,
            '{{color_primary_dark}}': finalJson.visual.palette.primary_dark,
            '{{color_accent}}': finalJson.visual.palette.accent,
            '{{color_bg_light}}': finalJson.visual.palette.background_light,
            '{{color_text_main}}': finalJson.visual.palette.text_main,
            '{{headline}}': finalJson.copy.headline,
            '{{subheadline}}': finalJson.copy.subheadline,
            '{{sobre_texto}}': finalJson.copy.sobre_texto,
            '{{whatsapp}}': finalJson.contato.whatsapp,
            '{{nome_empresa}}': finalJson.identidade.nome_empresa
        };

        for (const [key, value] of Object.entries(mappings)) {
            const regex = new RegExp(Builder.escapeRegExp(key), 'g');
            html = html.replace(regex, value || '');
        }

        html = Builder.renderLoop(html, 'servicos', finalJson.servicos.lista_servicos);
        html = Builder.renderLoop(html, 'fotos', finalJson.midia.fotos);

        return html;
    },
    renderLoop: (html, key, items) => {
        const startTag = `{{#${key}}}`;
        const endTag = `{{/${key}}}`;
        const regex = new RegExp(`${Builder.escapeRegExp(startTag)}([\\s\\S]*?)${Builder.escapeRegExp(endTag)}`, 'g');

        return html.replace(regex, (match, content) => {
            if (!items || items.length === 0) return '';
            return items.map(item => content.replace(/\{\{\.\}\}/g, item)).join('');
        });
    },
    escapeRegExp: (string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
};

if (typeof module !== 'undefined') {
    module.exports = Builder;
} else {
    window.Builder = Builder;
}

/**
 * generator/core/storage.js
 * Gerenciador de persistência via GitHub API.
 */

const Storage = {
    GITHUB_TOKEN: '', // Preenchido dinamicamente pelo .env no browser
    GITHUB_USER: 'paginaexpress',
    REPO_NAME: 'pagina-express-whatsapp',

    init: (token) => {
        Storage.GITHUB_TOKEN = token;
    },

    saveFile: async (path, content, message = 'Update data') => {
        const url = `https://api.github.com/repos/${Storage.GITHUB_USER}/${Storage.REPO_NAME}/contents/${path}`;

        // 1. Pegar o SHA se o arquivo já existir
        let sha = '';
        try {
            const res = await fetch(url, {
                headers: { 'Authorization': `token ${Storage.GITHUB_TOKEN}` }
            });
            if (res.ok) {
                const data = await res.json();
                sha = data.sha;
            }
        } catch (e) { }

        // 2. Salvar
        const body = {
            message: message,
            content: btoa(unescape(encodeURIComponent(content))),
            sha: sha
        };

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${Storage.GITHUB_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        return response.ok;
    },

    saveClient: async (slug, finalJson, isPublic = false) => {
        const path = isPublic ? `clientes/${slug}/config.json` : `data/previews/${slug}.json`;
        return await Storage.saveFile(path, JSON.stringify(finalJson, null, 2), `Save client: ${slug}`);
    }
};

if (typeof module !== 'undefined') {
    module.exports = Storage;
} else {
    window.Storage = Storage;
}

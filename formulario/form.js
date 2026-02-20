/**
 * Form.js - Pagina Express
 * Coleta dados do formulário e gera JSON compatível com CLIENT_DATA.
 */

const form = document.getElementById('clientForm');
const addServiceBtn = document.getElementById('addService');
const servicesContainer = document.getElementById('servicesContainer');
const uploadArea = document.getElementById('uploadArea');
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const progressBar = document.getElementById('progressBar');

let imagensBase64 = [];
const MAX_SERVICES = 8;
const MAX_IMAGES = 6;

// 1. Lógica de adicionar serviços dinamicamente
addServiceBtn.addEventListener('click', () => {
    const currentServices = servicesContainer.querySelectorAll('.service-entry').length;
    if (currentServices < MAX_SERVICES) {
        const div = document.createElement('div');
        div.className = 'service-entry';
        div.innerHTML = `<input type="text" name="servico[]" placeholder="Nome do serviço">`;
        servicesContainer.appendChild(div);
    } else {
        alert('Limite de 8 serviços atingido.');
    }
});

// 2. Lógica de Upload e Compressão de Imagens
uploadArea.addEventListener('click', () => imageInput.click());

imageInput.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);

    if (imagensBase64.length + files.length > MAX_IMAGES) {
        alert('Limite de 6 imagens atingido.');
        return;
    }

    for (const file of files) {
        const base64 = await compressAndBase64(file);
        imagensBase64.push(base64);
        renderPreview(base64);
    }
});

function renderPreview(base64) {
    const div = document.createElement('div');
    div.className = 'preview-item';
    div.innerHTML = `<img src="${base64}">`;
    imagePreview.appendChild(div);
}

async function compressAndBase64(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800;
                let width = img.width;
                let height = img.height;

                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.7)); // Comprime 70%
            };
        };
    });
}

// 3. Coleta de dados final
form.addEventListener('submit', (e) => {
    e.preventDefault();
    progressBar.style.width = '100%';

    const data = generateClientData();
    console.log('Dados Gerados:', data);

    // Feedback Visual
    document.getElementById('clientForm').classList.add('hidden');
    document.getElementById('successMessage').classList.remove('hidden');
    document.getElementById('jsonOutput').innerText = JSON.stringify(data, null, 2);

    // Download automático do JSON
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `config-${slugify(data.nome_empresa)}.json`;
    a.click();
});

function generateClientData() {
    const formData = new FormData(form);
    const servicos = Array.from(document.querySelectorAll('input[name="servico[]"]'))
        .map(input => input.value.trim())
        .filter(val => val !== '');

    return {
        nicho: formData.get('nicho'),
        nome_empresa: formData.get('nome_empresa'),
        cor_primaria: formData.get('cor_primaria'),
        whatsapp: formData.get('whatsapp'),
        descricao: formData.get('descricao'),
        servicos: servicos,
        imagens: imagensBase64,
        instagram: formData.get('instagram'),
        facebook: formData.get('facebook')
    };
}

// Utilitário simples para slug no nome do arquivo
function slugify(text) {
    return text.toString().toLowerCase().trim()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

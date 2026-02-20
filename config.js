/**
 * Configuração Global do Sistema Pagina Express
 * Versão: 1.0.0
 * Nome: Pagina Express WhatsApp
 */

const SYSTEM_CONFIG = {
  version: "1.0.0",
  name: "Pagina Express WhatsApp",
  slug_pattern: /^[a-z0-9-]+$/,
  limits: {
    max_images: 6,
    max_services: 8
  }
};

const CLIENT_DATA_TEMPLATE = {
  nome_empresa: "",
  cor_primaria: "#000000",
  whatsapp: "",
  descricao: "",
  servicos: [],
  imagens: [],
  instagram: "",
  facebook: ""
};

if (typeof module !== 'undefined') {
  module.exports = { SYSTEM_CONFIG, CLIENT_DATA_TEMPLATE };
}

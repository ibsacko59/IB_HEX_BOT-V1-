// ╔══════════════════════════════════════════╗
// ║        IB-HEX-BOT  — CONFIG              ║
// ║   Développé par Ibrahima Sory Sacko       ║
// ╚══════════════════════════════════════════╝

module.exports = {
  // ── Identité du bot ──────────────────────
  BOT_NAME      : 'IB_HEX_BOT',
  OWNER_NAME    : 'Ibrahima Sory Sacko',
  DEV_NAME      : 'Ibrahim Sory Sacko',
  VERSION       : '1.0',
  PREFIX        : 'Ib',

  // ── Numéro du propriétaire ───────────────
  OWNER_NUMBER  : '224621963059',

  // ── Image du menu ────────────────────────
  MENU_IMAGE    : 'https://i.ibb.co/KcM77nr2/1771804016858.png',

  // ── Port du serveur Web (QR Code) ────────
  PORT          : process.env.PORT || 3000,

  // ── APIs publiques ────────────────────────
  GEMINI_KEY    : process.env.GEMINI_KEY    || '',
  OPENAI_KEY    : process.env.OPENAI_KEY    || '',

  // ── Dossier de session ───────────────────
  SESSION_DIR   : './session',

  // ── Fonctionnalités ON/OFF ───────────────
  FEATURES: {
    ANTI_DELETE   : false,
    ANTI_LINK     : false,
    ANTI_STICKER  : false,
    ANTI_GM       : false,
    CHATBOT       : false,
  },

  // ── Réactions (otakugifs.xyz API) ────────
  REACTION_GIFS: {
    yeet   : 'https://api.otakugifs.xyz/gif?reaction=throw',
    slap   : 'https://api.otakugifs.xyz/gif?reaction=slap',
    nom    : 'https://api.otakugifs.xyz/gif?reaction=nom',
    poke   : 'https://api.otakugifs.xyz/gif?reaction=poke',
    wave   : 'https://api.otakugifs.xyz/gif?reaction=wave',
    smile  : 'https://api.otakugifs.xyz/gif?reaction=smile',
    dance  : 'https://api.otakugifs.xyz/gif?reaction=dance',
    smug   : 'https://api.otakugifs.xyz/gif?reaction=smug',
    cringe : 'https://api.otakugifs.xyz/gif?reaction=cringe',
    happy  : 'https://api.otakugifs.xyz/gif?reaction=happy',
  }
}

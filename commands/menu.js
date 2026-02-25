// ╔══════════════════════════════════════════════╗
// ║   IB-HEX-BOT — commands/menu.js             ║
// ╚══════════════════════════════════════════════╝

const config = require('../config')
const moment = require('moment')
moment.locale('fr')

let startTime = Date.now()

// ── Uptime formaté ──────────────────────────────
function getUptime() {
  const ms  = Date.now() - startTime
  const s   = Math.floor(ms / 1000)
  const m   = Math.floor(s / 60)
  const h   = Math.floor(m / 60)
  const d   = Math.floor(h / 24)
  if (d > 0)  return `${d}j ${h % 24}h ${m % 60}m`
  if (h > 0)  return `${h}h ${m % 60}m ${s % 60}s`
  if (m > 0)  return `${m}m ${s % 60}s`
  return `${s}s`
}

// ── MENU ────────────────────────────────────────
async function menu(sock, msg, from, args, ctx) {
  const uptime = getUptime()
  const date   = moment().format('dddd DD MMMM YYYY • HH:mm')

  // 1) Envoyer l'image du menu
  await sock.sendMessage(from, {
    image: { url: config.MENU_IMAGE },
    caption: ''
  })

  // 2) Envoyer le texte du menu
  const text = `
╭──𝗜𝗕-𝗛𝗘𝗫-𝗕𝗢𝗧─────🥷
│ 𝗕𝗼𝘁 : ${config.BOT_NAME}
│ 𝗧𝗲𝗺𝗽𝘀 𝗗𝗲 𝗙𝗼𝗻𝗰𝘁𝗶𝗼𝗻𝗻𝗲𝗺𝗲𝗻𝘁 : ${uptime}
│ 𝗠𝗼𝗱𝗲 : public
│ 𝗣𝗿𝗲𝗳𝗶𝘅𝗲 : ${config.PREFIX}
│ 𝗣𝗿𝗼𝗽𝗿𝗶𝗲́𝘁𝗮𝗶𝗿𝗲 : ${config.OWNER_NAME}
│ 𝗗𝗲́𝘃𝗲𝗹𝗼𝗽𝗽𝗲𝘂𝗿 : ${config.DEV_NAME}
│ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻 : ${config.VERSION}
╰──────────────🥷
🤖────────────────🤖
🥷 𝐈𝐁𝐑𝐀𝐇𝐈𝐌𝐀 𝐒𝐎𝐑𝐘 𝐒𝐀𝐂𝐊𝐎 🥷
🤖────────────────🤖
🥷─────────────────🥷
『 𝗠𝗘𝗡𝗨-𝗛𝗘𝗫-𝗕𝗢𝗧 』
│ ⬡ 𝗺𝗲𝗻𝘂 → afficher le menu
│ ⬡ 𝗮𝗹𝗶𝘃𝗲 → état du bot
│ ⬡ 𝗱𝗲𝘃 → développeur
│ ⬡ 𝗮𝗹𝗹𝘃𝗮𝗿 → toutes les variables
│ ⬡ 𝗽𝗶𝗻𝗴 → vitesse du bot
│ ⬡ 𝗼𝘄𝗻𝗲𝗿 → propriétaire
╰──────────────────🥷
🥷──────────────────🥷
『 𝗢𝗪𝗡𝗘𝗥-𝗛𝗘𝗫-𝗕𝗢𝗧 』
│ ⬡ 𝗷𝗼𝗶𝗻 → rejoindre un groupe
│ ⬡ 𝗹𝗲𝗮𝘃𝗲 → quitter un groupe
│ ⬡ 𝗮𝗻𝘁𝗶𝗱𝗲𝗹𝗲𝘁𝗲 → anti-suppression
│ ⬡ 𝘂𝗽𝗹𝗼𝗮𝗱 → téléverser
│ ⬡ 𝘃𝘃 → vue
│ ⬡ 𝗮𝗹𝗹𝗰𝗺𝗱𝘀 → toutes les commandes
│ ⬡ 𝗱𝗲𝗹𝗲𝘁𝗲 → supprimer
│ ⬡ 🥷 → vue unique → privé
╰──────────────────🥷
🥷──────────────────🥷
『 𝗜𝗔-𝗛𝗘𝗫-𝗕𝗢𝗧 』
│ ⬡ 𝗮𝗶 → intelligence artificielle
│ ⬡ 𝗯𝘂𝗴 → signaler un bug
│ ⬡ 𝗯𝗼𝘁 → informations bot
│ ⬡ 𝗴𝗲𝗺𝗶𝗻𝗶 → IA Gemini
│ ⬡ 𝗰𝗵𝗮𝘁𝗯𝗼𝘁 → discussion IA
│ ⬡ 𝗴𝗽𝘁 → ChatGPT
╰──────────────────🥷
🥷──────────────────🥷
『 𝗖𝗢𝗡𝗩𝗘𝗥𝗧𝗜𝗦𝗦𝗘𝗨𝗥-𝗛𝗘𝗫-𝗕𝗢𝗧 』
│ ⬡ 𝗮𝘁𝘁𝗽 → texte en sticker
│ ⬡ 𝘁𝗼𝗶𝗺𝗮𝗴𝗲 → convertir en image
│ ⬡ 𝗴𝗶𝗺𝗮𝗴𝗲 → image Google
│ ⬡ 𝗺𝗽3 → convertir en MP3
│ ⬡ 𝘀𝘀 → capture d'écran
│ ⬡ 𝗳𝗮𝗻𝗰𝘆 → texte stylé
│ ⬡ 𝘂𝗿𝗹 → lien
│ ⬡ 𝘀𝘁𝗶𝗰𝗸𝗲𝗿 → créer sticker
│ ⬡ 𝘁𝗮𝗸𝗲 → récupérer média
╰──────────────────🥷
🥷──────────────────🥷
『 𝗥𝗘𝗖𝗛𝗘𝗥𝗖𝗛𝗘-𝗛𝗘𝗫-𝗕𝗢𝗧 』
│ ⬡ 𝗴𝗼𝗼𝗴𝗹𝗲 → recherche Google
│ ⬡ 𝗽𝗹𝗮𝘆 → Play Store
│ ⬡ 𝘃𝗶𝗱𝗲𝗼 → recherche vidéo
│ ⬡ 𝘀𝗼𝗻𝗴 → musique
│ ⬡ 𝗺𝗲𝗱𝗶𝗮𝗳𝗶𝗿𝗲 → MediaFire
│ ⬡ 𝗳𝗮𝗰𝗲𝗯𝗼𝗼𝗸 → Facebook
│ ⬡ 𝗶𝗻𝘀𝘁𝗮𝗴𝗿𝗮𝗺 → Instagram
│ ⬡ 𝘁𝗶𝗸𝘁𝗼𝗸 → TikTok
│ ⬡ 𝗹𝘆𝗿𝗶𝗰𝘀 → paroles
│ ⬡ 𝗶𝗺𝗮𝗴𝗲 → images
╰──────────────────🥷
🥷──────────────────🥷
『 𝗗𝗜𝗩𝗘𝗥𝗧𝗜𝗦𝗦𝗘𝗠𝗘𝗡𝗧-𝗛𝗘𝗫-𝗕𝗢𝗧 』
│ ⬡ 𝗴𝗲𝘁𝗽𝗽 → photo de profil
│ ⬡ 𝗴𝗼𝗼𝗱𝗻𝗶𝗴𝗵𝘁 → bonne nuit
│ ⬡ 𝘄𝗰𝗴 → classement
│ ⬡ 𝗾𝘂𝗶𝘇𝘇 → quiz
│ ⬡ 𝗮𝗻𝗶𝗺𝗲 → anime
│ ⬡ 𝗽𝗿𝗼𝗳𝗶𝗹𝗲 → profil
│ ⬡ 𝗰𝗼𝘂𝗽𝗹𝗲 → couple
│ ⬡ 𝗽𝗼𝗹𝗹 → sondage
│ ⬡ 𝗲𝗺𝗼𝗷𝗶𝗺𝗶𝘅 → mélange d'emojis
╰──────────────────🥷
🥷─────────────────🥷
『 𝗚𝗥𝗢𝗨𝗣𝗘𝗦-𝗛𝗘𝗫-𝗕𝗢𝗧 』
│ ⬡ 𝗸𝗶𝗰𝗸𝗮𝗹𝗹 → exclure tous
│ ⬡ 𝘁𝗮𝗴𝗮𝗱𝗺𝗶𝗻 → mention admins
│ ⬡ 𝗮𝗰𝗰𝗲𝗽𝘁𝗮𝗹𝗹 → accepter tous
│ ⬡ 𝘁𝗮𝗴𝗮𝗹𝗹 → mentionner tous
│ ⬡ 𝗴𝗲𝘁𝗮𝗹𝗹 → récupérer membres
│ ⬡ 𝗴𝗿𝗼𝘂𝗽 𝗰𝗹𝗼𝘀𝗲 → fermer groupe
│ ⬡ 𝗴𝗿𝗼𝘂𝗽 𝗼𝗽𝗲𝗻 → ouvrir groupe
│ ⬡ 𝗮𝗱𝗱 → ajouter membre
│ ⬡ 𝘃𝗰𝗳 → contacts VCF
│ ⬡ 𝗹𝗶𝗻𝗸𝗴𝗰 → lien du groupe
│ ⬡ 𝗮𝗻𝘁𝗶𝗹𝗶𝗻𝗸 → anti-lien
│ ⬡ 𝗮𝗻𝘁𝗶𝘀𝘁𝗶𝗰𝗸𝗲𝗿 → anti-sticker
│ ⬡ 𝗮𝗻𝘁𝗶𝗴𝗺 → anti-mention
│ ⬡ 𝗰𝗿𝗲𝗮𝘁𝗲 → créer groupe
│ ⬡ 𝗴𝗿𝗼𝘂𝗽𝗶𝗻𝗳𝗼 → infos groupe
╰──────────────────🥷
🥷──────────────────🥷
『 𝗥𝗘́𝗔𝗖𝗧𝗜𝗢𝗡𝗦-𝗛𝗘𝗫-𝗕𝗢𝗧 』
│ ⬡ 𝘆𝗲𝗲𝘁 → jeter
│ ⬡ 𝘀𝗹𝗮𝗽 → gifler
│ ⬡ 𝗻𝗼𝗺 → manger
│ ⬡ 𝗽𝗼𝗸𝗲 → toucher
│ ⬡ 𝘄𝗮𝘃𝗲 → saluer
│ ⬡ 𝘀𝗺𝗶𝗹𝗲 → sourire
│ ⬡ 𝗱𝗮𝗻𝗰𝗲 → danser
│ ⬡ 𝘀𝗺𝘂𝗴 → sourire narquois
│ ⬡ 𝗰𝗿𝗶𝗻𝗴𝗲 → malaise
│ ⬡ 𝗵𝗮𝗽𝗽𝘆 → heureux
╰──────────────────🥷
🥷───────────────────🥷
⚡ 𝐂𝐄𝐍𝐓𝐑𝐀𝐋-𝐇𝐄𝐗 ⚡
propulsé par 𝐈𝐛-𝐒𝐚𝐜𝐤𝐨™
🥷───────────────────🥷`.trim()

  await sock.sendMessage(from, { text }, { quoted: msg })
}

// ── ALIVE ───────────────────────────────────────
async function alive(sock, msg, from, args, ctx) {
  const uptime = getUptime()
  await sock.sendMessage(from, {
    image: { url: config.MENU_IMAGE },
    caption: `🥷 *IB-HEX-BOT est en ligne !*\n\n⏱️ Uptime : *${uptime}*\n🏷️ Préfixe : *${config.PREFIX}*\n🤖 Version : *${config.VERSION}*\n👤 Dev : *${config.DEV_NAME}*\n\n_Propulsé par Ib-Sacko™_ 🥷`
  }, { quoted: msg })
}

// ── PING ────────────────────────────────────────
async function ping(sock, msg, from, args, ctx) {
  const t1 = Date.now()
  await sock.sendMessage(from, { text: '⏳ Calcul en cours…' }, { quoted: msg })
  const t2 = Date.now()
  await ctx.reply(`🏓 *Pong!*\n⚡ Vitesse : *${t2 - t1} ms*`)
}

// ── DEV ─────────────────────────────────────────
async function dev(sock, msg, from, args, ctx) {
  await sock.sendMessage(from, {
    text: `🥷 *Développeur IB-HEX-BOT*\n\n👤 Nom : *${config.DEV_NAME}*\n📱 Numéro : *+${config.OWNER_NUMBER}*\n🤖 Bot : *${config.BOT_NAME}*\n🏷️ Version : *${config.VERSION}*\n\n_Ib-Sacko™ — All rights reserved_`
  }, { quoted: msg })
}

// ── OWNER ────────────────────────────────────────
async function owner(sock, msg, from, args, ctx) {
  await sock.sendMessage(from, {
    text: `👑 *Propriétaire IB-HEX-BOT*\n\n👤 Nom : *${config.OWNER_NAME}*\n📱 Contact : wa.me/${config.OWNER_NUMBER}\n🤖 Bot : *${config.BOT_NAME}*`
  }, { quoted: msg })
}

// ── ALLVAR ───────────────────────────────────────
async function allvar(sock, msg, from, args, ctx) {
  const f = config.FEATURES
  await ctx.reply(
    `📊 *Variables IB-HEX-BOT*\n\n` +
    `🤖 Bot : ${config.BOT_NAME}\n` +
    `🏷️ Préfixe : ${config.PREFIX}\n` +
    `👤 Owner : ${config.OWNER_NAME}\n` +
    `🔢 Version : ${config.VERSION}\n\n` +
    `🔧 *Fonctionnalités :*\n` +
    `• Anti-Delete : ${f.ANTI_DELETE ? '✅ ON' : '❌ OFF'}\n` +
    `• Anti-Lien : ${f.ANTI_LINK ? '✅ ON' : '❌ OFF'}\n` +
    `• Anti-Sticker : ${f.ANTI_STICKER ? '✅ ON' : '❌ OFF'}\n` +
    `• Anti-GM : ${f.ANTI_GM ? '✅ ON' : '❌ OFF'}\n` +
    `• Chatbot : ${f.CHATBOT ? '✅ ON' : '❌ OFF'}`
  )
}

// ── HELP ─────────────────────────────────────────
async function help(sock, msg, from, args, ctx) {
  await sock.sendMessage(from, {
    image: { url: config.MENU_IMAGE },
    caption: `🥷 *Guide IB-HEX-BOT*\n\n` +
    `📌 *Comment utiliser le bot ?*\n` +
    `Toutes les commandes commencent par le préfixe *${config.PREFIX}*\n\n` +
    `📝 *Exemples :*\n` +
    `• ${config.PREFIX}menu → Affiche le menu\n` +
    `• ${config.PREFIX}ping → Teste la vitesse\n` +
    `• ${config.PREFIX}ai Bonjour → Parle avec l'IA\n` +
    `• ${config.PREFIX}sticker → Crée un sticker\n` +
    `• ${config.PREFIX}tiktok [lien] → Télécharge TikTok\n\n` +
    `📂 *Catégories :*\n` +
    `🔧 Menu · 🤖 IA · 🔄 Convertisseur\n` +
    `🔍 Recherche · 🎮 Divertissement\n` +
    `👥 Groupes · 💫 Réactions\n\n` +
    `🥷 *Commande spéciale :*\n` +
    `Envoyez un message en *vue unique* → le bot vous le renvoie en privé automatiquement !\n\n` +
    `📱 *Support :* wa.me/${config.OWNER_NUMBER}\n` +
    `_Ib-Sacko™ 🥷_`
  }, { quoted: msg })
}

// ── ALLCMDS ──────────────────────────────────────
async function allcmds(sock, msg, from, args, ctx) {
  const P = config.PREFIX
  await ctx.reply(
    `📋 *TOUTES LES COMMANDES — IB-HEX-BOT* 🥷\n\n` +
    `🔧 *MENU*\n${P}menu • ${P}alive • ${P}ping • ${P}dev • ${P}owner • ${P}allvar • ${P}help • ${P}allcmds\n\n` +
    `🤖 *IA*\n${P}ai • ${P}gemini • ${P}gpt • ${P}chatbot • ${P}bug • ${P}bot\n\n` +
    `🔄 *CONVERTISSEUR*\n${P}sticker • ${P}toimage • ${P}attp • ${P}mp3 • ${P}ss • ${P}fancy • ${P}url • ${P}take\n\n` +
    `🔍 *RECHERCHE*\n${P}google • ${P}image • ${P}video • ${P}song • ${P}tiktok • ${P}instagram • ${P}facebook • ${P}play • ${P}mediafire • ${P}lyrics\n\n` +
    `🎮 *DIVERTISSEMENT*\n${P}getpp • ${P}goodnight • ${P}wcg • ${P}quizz • ${P}anime • ${P}profile • ${P}couple • ${P}poll • ${P}emojimix\n\n` +
    `👥 *GROUPES*\n${P}kickall • ${P}tagadmin • ${P}acceptall • ${P}tagall • ${P}getall • ${P}add • ${P}vcf • ${P}linkgc • ${P}antilink • ${P}antisticker • ${P}antigm • ${P}create • ${P}groupinfo • ${P}antidelete • ${P}join • ${P}leave • ${P}delete • ${P}upload • ${P}vv\n\n` +
    `💫 *RÉACTIONS*\n${P}yeet • ${P}slap • ${P}nom • ${P}poke • ${P}wave • ${P}smile • ${P}dance • ${P}smug • ${P}cringe • ${P}happy\n\n` +
    `_Total : ~60 commandes disponibles_ 🥷`
  )
}

module.exports = { menu, alive, ping, dev, owner, allvar, help, allcmds }

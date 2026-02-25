// ╔══════════════════════════════════════════════╗
// ║   IB-HEX-BOT — lib/functions.js             ║
// ╚══════════════════════════════════════════════╝

const { getContentType } = require('@whiskeysockets/baileys')

/**
 * Récupère le texte principal d'un message
 */
function getMessageText(msg) {
  if (!msg?.message) return ''
  const type = getContentType(msg.message)
  switch (type) {
    case 'conversation':           return msg.message.conversation
    case 'extendedTextMessage':    return msg.message.extendedTextMessage.text
    case 'imageMessage':           return msg.message.imageMessage.caption || ''
    case 'videoMessage':           return msg.message.videoMessage.caption || ''
    case 'documentMessage':        return msg.message.documentMessage.caption || ''
    case 'buttonsResponseMessage': return msg.message.buttonsResponseMessage.selectedButtonId
    case 'listResponseMessage':    return msg.message.listResponseMessage.singleSelectReply.selectedRowId
    default: return ''
  }
}

/**
 * Formate un uptime en ms en chaîne lisible
 */
function formatUptime(ms) {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const h = Math.floor(m / 60)
  const d = Math.floor(h / 24)
  if (d > 0) return `${d}j ${h % 24}h ${m % 60}m`
  if (h > 0) return `${h}h ${m % 60}m ${s % 60}s`
  if (m > 0) return `${m}m ${s % 60}s`
  return `${s}s`
}

/**
 * Extrait le numéro depuis un JID WhatsApp
 */
function jidToNum(jid) {
  return jid?.replace(/[^0-9]/g, '') || ''
}

/**
 * Vérifie si un JID est un groupe
 */
function isGroupJid(jid) {
  return jid?.endsWith('@g.us') || false
}

/**
 * Génère un nombre aléatoire entre min et max
 */
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Sleep / délai asynchrone
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Tronque un texte long
 */
function truncate(text, max = 200) {
  if (!text) return ''
  return text.length > max ? text.slice(0, max) + '…' : text
}

module.exports = { getMessageText, formatUptime, jidToNum, isGroupJid, rand, sleep, truncate }

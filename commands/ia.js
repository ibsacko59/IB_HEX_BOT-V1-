// ╔══════════════════════════════════════════════╗
// ║   IB-HEX-BOT — commands/ia.js               ║
// ╚══════════════════════════════════════════════╝

const axios  = require('axios')
const config = require('../config')

// ── AI (libre sans clé via API publique) ────────
async function ai(sock, msg, from, args, ctx) {
  const query = args.join(' ')
  if (!query) return ctx.reply(`❓ Usage : *${config.PREFIX}ai [question]*\nExemple : ${config.PREFIX}ai Quelle est la capitale de la France ?`)

  await ctx.react('🤔')
  try {
    // Utiliser l'API gratuite SimSimi / ou ProgramX fallback
    const res = await axios.get(`https://api.simsimi.vn/v1/simsimi/fr?text=${encodeURIComponent(query)}`, { timeout: 10000 })
    const rep = res.data?.success || res.data?.message || 'Je ne sais pas répondre à ça 🤖'
    await ctx.reply(`🤖 *IB-AI*\n\n💬 ${query}\n\n🧠 ${rep}`)
  } catch {
    // Fallback : API publique de type ChatBot
    try {
      const r2 = await axios.get(`https://api.lolhuman.xyz/api/ai?text=${encodeURIComponent(query)}&apikey=public`, { timeout: 10000 })
      const rep2 = r2.data?.result || 'Désolé, je ne peux pas répondre en ce moment.'
      await ctx.reply(`🤖 *IB-AI*\n\n💬 ${query}\n\n🧠 ${rep2}`)
    } catch (e) {
      await ctx.reply(`❌ Service IA temporairement indisponible.\nRéessayez dans quelques instants.`)
    }
  }
}

// ── GEMINI ──────────────────────────────────────
async function gemini(sock, msg, from, args, ctx) {
  const query = args.join(' ')
  if (!query) return ctx.reply(`❓ Usage : *${config.PREFIX}gemini [question]*`)

  await ctx.react('🤔')
  try {
    if (!config.GEMINI_KEY) throw new Error('Clé API Gemini non configurée')
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${config.GEMINI_KEY}`,
      { contents: [{ parts: [{ text: query }] }] },
      { timeout: 15000 }
    )
    const rep = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Aucune réponse générée.'
    await ctx.reply(`✨ *Gemini IA*\n\n💬 ${query}\n\n${rep}`)
  } catch (e) {
    // Fallback gratuit
    try {
      const r2 = await axios.get(`https://api.simsimi.vn/v1/simsimi/fr?text=${encodeURIComponent(query)}`, { timeout: 10000 })
      const rep = r2.data?.success || 'Service indisponible.'
      await ctx.reply(`✨ *Gemini IA (fallback)*\n\n${rep}`)
    } catch {
      await ctx.reply(`❌ Gemini indisponible. Configurez GEMINI_KEY dans les variables d'environnement.`)
    }
  }
}

// ── GPT ─────────────────────────────────────────
async function gpt(sock, msg, from, args, ctx) {
  const query = args.join(' ')
  if (!query) return ctx.reply(`❓ Usage : *${config.PREFIX}gpt [question]*`)

  await ctx.react('🤔')
  try {
    if (!config.OPENAI_KEY) throw new Error('Clé OpenAI non configurée')
    const res = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Tu es IB-HEX-BOT, un assistant WhatsApp en français.' },
        { role: 'user', content: query }
      ]
    }, {
      headers: { Authorization: `Bearer ${config.OPENAI_KEY}` },
      timeout: 20000
    })
    const rep = res.data?.choices?.[0]?.message?.content || 'Aucune réponse.'
    await ctx.reply(`🧠 *ChatGPT*\n\n💬 ${query}\n\n${rep}`)
  } catch (e) {
    await ctx.reply(`❌ GPT indisponible. Configurez OPENAI_KEY dans les variables d'environnement.`)
  }
}

// ── CHATBOT (toggle ON/OFF) ──────────────────────
async function chatbot(sock, msg, from, args, ctx) {
  if (ctx && args && args[0]) {
    const toggle = args[0].toLowerCase()
    if (toggle === 'on') {
      config.FEATURES.CHATBOT = true
      return ctx.reply('🤖 Chatbot *activé* !')
    } else if (toggle === 'off') {
      config.FEATURES.CHATBOT = false
      return ctx.reply('🤖 Chatbot *désactivé* !')
    }
  }
  // Mode chatbot direct
  if (!ctx) return
  const query = typeof args === 'string' ? args : args?.join(' ') || ctx?.body || ''
  if (!query) return ctx.reply(`🤖 Usage : *${config.PREFIX}chatbot on/off*\nOu activez-le et parlez directement.`)
  try {
    const res = await axios.get(`https://api.simsimi.vn/v1/simsimi/fr?text=${encodeURIComponent(query)}`, { timeout: 10000 })
    const rep = res.data?.success || '🤖 Je réfléchis…'
    await sock.sendMessage(from, { text: rep }, { quoted: msg })
  } catch (e) {
    await sock.sendMessage(from, { text: '🤖 Je ne sais pas répondre à ça !' }, { quoted: msg })
  }
}

// ── BUG ─────────────────────────────────────────
async function bug(sock, msg, from, args, ctx) {
  const report = args.join(' ')
  if (!report) return ctx.reply(`❓ Usage : *${config.PREFIX}bug [description du bug]*`)
  const ownerJid = `${config.OWNER_NUMBER}@s.whatsapp.net`
  await sock.sendMessage(ownerJid, {
    text: `🐛 *Rapport de Bug — IB-HEX-BOT*\n\n👤 De : ${ctx.senderNum}\n📍 Lieu : ${ctx.isGroup ? 'Groupe' : 'Privé'}\n\n📝 Bug :\n${report}`
  })
  await ctx.reply('✅ Bug signalé au développeur. Merci !')
}

// ── BOT INFO ─────────────────────────────────────
async function bot(sock, msg, from, args, ctx) {
  await sock.sendMessage(from, {
    image: { url: config.MENU_IMAGE },
    caption: `🤖 *Informations — IB-HEX-BOT*\n\n` +
    `🏷️ Nom : *${config.BOT_NAME}*\n` +
    `🔢 Version : *${config.VERSION}*\n` +
    `🔑 Préfixe : *${config.PREFIX}*\n` +
    `👤 Propriétaire : *${config.OWNER_NAME}*\n` +
    `💻 Développeur : *${config.DEV_NAME}*\n` +
    `📚 Librairie : *@whiskeysockets/baileys*\n` +
    `🌐 Hébergement : *Render.com*\n` +
    `📦 Dépôt : *GitHub*\n\n` +
    `_Ib-Sacko™ 🥷_`
  }, { quoted: msg })
}

module.exports = { ai, gemini, gpt, chatbot, bug, bot }

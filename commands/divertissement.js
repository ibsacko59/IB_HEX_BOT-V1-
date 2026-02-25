// ╔══════════════════════════════════════════════╗
// ║   IB-HEX-BOT — commands/divertissement.js   ║
// ╚══════════════════════════════════════════════╝

const axios  = require('axios')
const config = require('../config')

// ── GETPP (photo de profil) ──────────────────────
async function getpp(sock, msg, from, args, ctx) {
  let target = args[0]?.replace(/[^0-9]/g, '')
  const quoted = msg.message?.extendedTextMessage?.contextInfo
  if (!target && quoted?.participant) target = quoted.participant.replace(/[^0-9]/g, '')
  if (!target) target = ctx.senderNum

  const jid = `${target}@s.whatsapp.net`
  await ctx.react('⏳')
  try {
    const ppUrl = await sock.profilePictureUrl(jid, 'image')
    await sock.sendMessage(from, {
      image: { url: ppUrl },
      caption: `📸 *Photo de profil*\n👤 +${target}`
    }, { quoted: msg })
  } catch (e) {
    await ctx.reply(`❌ Photo de profil introuvable ou privée pour +${target}`)
  }
}

// ── GOODNIGHT ────────────────────────────────────
async function goodnight(sock, msg, from, args, ctx) {
  const gifs = [
    'https://media.giphy.com/media/3oEdva9BUHPHz2yenG/giphy.gif',
    'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif',
    'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif',
  ]
  const gif = gifs[Math.floor(Math.random() * gifs.length)]
  try {
    await sock.sendMessage(from, {
      video: { url: gif },
      gifPlayback: true,
      caption: `🌙 *Bonne nuit !*\n_Propulsé par IB-HEX-BOT 🥷_`
    }, { quoted: msg })
  } catch {
    await ctx.reply('🌙 *Bonne nuit à tous !* 😴✨\n_Dors bien_ 🥷')
  }
}

// ── WCG (classement fictif) ──────────────────────
async function wcg(sock, msg, from, args, ctx) {
  let groupMembers = []
  if (ctx.isGroup) {
    try {
      const meta  = await sock.groupMetadata(from)
      groupMembers = meta.participants.map(p => `+${p.id.replace('@s.whatsapp.net', '')}`)
    } catch {}
  }
  const top = groupMembers.length > 0 ? groupMembers.slice(0, 5) : ['Membre 1', 'Membre 2', 'Membre 3']
  const scores = top.map((m, i) => `${['🥇','🥈','🥉','4️⃣','5️⃣'][i]} ${m} — ${Math.floor(Math.random()*1000)} pts`)
  await ctx.reply(`🏆 *Classement du Groupe*\n\n${scores.join('\n')}\n\n_IB-HEX-BOT 🥷_`)
}

// ── QUIZZ ────────────────────────────────────────
const questions = [
  { q: 'Quelle est la capitale de la France ?', a: 'paris', hint: 'Ville lumière' },
  { q: 'Combien font 12 × 12 ?', a: '144', hint: 'Carré de 12' },
  { q: 'Quelle est la planète la plus proche du Soleil ?', a: 'mercure', hint: '1ère planète' },
  { q: 'Qui a inventé l\'ampoule électrique ?', a: 'edison', hint: 'Thomas ...' },
  { q: 'Quel est le plus grand océan ?', a: 'pacifique', hint: '165 millions km²' },
  { q: 'En quelle année a eu lieu la Révolution française ?', a: '1789', hint: 'XVIIIe siècle' },
  { q: 'Quelle est la monnaie du Japon ?', a: 'yen', hint: '¥' },
  { q: 'Quel animal est le plus rapide du monde ?', a: 'guépard', hint: '120 km/h' },
]
const activeQuizzes = new Map()

async function quizz(sock, msg, from, args, ctx) {
  if (activeQuizzes.has(from)) {
    const current = activeQuizzes.get(from)
    const answer  = args.join(' ').toLowerCase().trim()
    if (answer === current.a) {
      activeQuizzes.delete(from)
      return ctx.reply(`🎉 *Bonne réponse !* ✅\nRéponse : *${current.a}*\n_+10 pts pour @${ctx.senderNum}_ 🥷`)
    }
    return ctx.reply(`❌ Mauvaise réponse.\n💡 Indice : *${current.hint}*\nRépondez avec *${config.PREFIX}quizz [réponse]*`)
  }
  const q = questions[Math.floor(Math.random() * questions.length)]
  activeQuizzes.set(from, q)
  setTimeout(() => {
    if (activeQuizzes.has(from)) {
      activeQuizzes.delete(from)
      sock.sendMessage(from, { text: `⏰ Temps écoulé !\nLa réponse était : *${q.a}*` })
    }
  }, 30000)
  await ctx.reply(`❓ *Quiz IB-HEX-BOT*\n\n${q.q}\n\n⏰ Vous avez 30 secondes !\n_Répondez avec ${config.PREFIX}quizz [réponse]_`)
}

// ── ANIME ────────────────────────────────────────
async function anime(sock, msg, from, args, ctx) {
  const type = args[0] || 'waifu'
  await ctx.react('⏳')
  try {
    const res = await axios.get(`https://api.waifu.pics/sfw/${type}`, { timeout: 10000 })
    const url  = res.data?.url
    if (!url) return ctx.reply('❌ Aucune image trouvée.')
    await sock.sendMessage(from, {
      image: { url },
      caption: `🎌 *Anime — ${type}*\n_IB-HEX-BOT 🥷_`
    }, { quoted: msg })
  } catch {
    const cats = ['neko', 'shinobu', 'megumin', 'bully', 'cuddle', 'cry', 'hug', 'awoo', 'kiss']
    const cat  = cats[Math.floor(Math.random() * cats.length)]
    try {
      const r2 = await axios.get(`https://nekos.best/api/v2/${cat}`, { timeout: 10000 })
      const img = r2.data?.results?.[0]?.url
      if (img) await sock.sendMessage(from, { image: { url: img }, caption: `🎌 *Anime — ${cat}*\n_IB-HEX-BOT 🥷_` }, { quoted: msg })
      else ctx.reply('❌ Service anime indisponible.')
    } catch (e) {
      await ctx.reply(`❌ Erreur anime : ${e.message}`)
    }
  }
}

// ── PROFILE ──────────────────────────────────────
async function profile(sock, msg, from, args, ctx) {
  let target = args[0]?.replace(/[^0-9]/g, '') || ctx.senderNum
  const jid  = `${target}@s.whatsapp.net`
  let ppUrl  = config.MENU_IMAGE
  try { ppUrl = await sock.profilePictureUrl(jid, 'image') } catch {}
  let about = ''
  try { const s = await sock.fetchStatus(jid); about = s?.status || '' } catch {}
  await sock.sendMessage(from, {
    image: { url: ppUrl },
    caption: `👤 *Profil — +${target}*\n📝 ${about || 'Pas de statut'}\n_IB-HEX-BOT 🥷_`
  }, { quoted: msg })
}

// ── COUPLE ──────────────────────────────────────
async function couple(sock, msg, from, args, ctx) {
  if (!ctx.isGroup) return ctx.reply('❌ Cette commande fonctionne uniquement en groupe !')
  try {
    const meta    = await sock.groupMetadata(from)
    const members = meta.participants
    if (members.length < 2) return ctx.reply('❌ Pas assez de membres dans le groupe.')
    const shuffle = [...members].sort(() => Math.random() - 0.5)
    const p1 = shuffle[0].id.replace('@s.whatsapp.net', '')
    const p2 = shuffle[1].id.replace('@s.whatsapp.net', '')
    const compat = Math.floor(Math.random() * 51) + 50
    await sock.sendMessage(from, {
      text: `💑 *Couple du jour — IB-HEX-BOT*\n\n❤️ @${p1} × @${p2}\n\n💘 Compatibilité : *${compat}%*\n_${compat > 80 ? 'Parfait ensemble ! 🔥' : compat > 60 ? 'Beau couple ! 💕' : 'Pourquoi pas 😄'}_ \n\n_IB-HEX-BOT 🥷_`,
      mentions: [shuffle[0].id, shuffle[1].id]
    }, { quoted: msg })
  } catch (e) {
    await ctx.reply(`❌ Erreur : ${e.message}`)
  }
}

// ── POLL (sondage) ─────────────────────────────
async function poll(sock, msg, from, args, ctx) {
  const full  = args.join(' ')
  const parts = full.split('|').map(p => p.trim())
  if (parts.length < 3) return ctx.reply(`❓ Usage : *${config.PREFIX}poll [question] | [option1] | [option2] | ...*`)
  const question = parts[0]
  const options  = parts.slice(1)
  await sock.sendMessage(from, {
    poll: {
      name: question,
      values: options.slice(0, 12),
      selectableCount: 1
    }
  }, { quoted: msg })
}

// ── EMOJIMIX ────────────────────────────────────
async function emojimix(sock, msg, from, args, ctx) {
  const emojis = ['😀','😂','🥰','😎','🤔','😴','🥳','😜','🤩','😈','🥷','👻','🎃','💫','🔥','⚡','🌈','🎯']
  const e1 = emojis[Math.floor(Math.random() * emojis.length)]
  const e2 = emojis[Math.floor(Math.random() * emojis.length)]
  try {
    const url = `https://www.gstatic.com/android/keyboard/emojikitchen/20201001/${
      e1.codePointAt(0).toString(16)
    }/${e1.codePointAt(0).toString(16)}_${e2.codePointAt(0).toString(16)}.png`
    await sock.sendMessage(from, {
      image: { url },
      caption: `✨ *EmojiMix* : ${e1} + ${e2}\n_IB-HEX-BOT 🥷_`
    }, { quoted: msg })
  } catch {
    await ctx.reply(`✨ *EmojiMix*\n\n${e1} + ${e2} = ${e1}${e2}🎨\n_IB-HEX-BOT 🥷_`)
  }
}

module.exports = { getpp, goodnight, wcg, quizz, anime, profile, couple, poll, emojimix }

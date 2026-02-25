// ╔══════════════════════════════════════════════╗
// ║   IB-HEX-BOT — commands/convertisseur.js    ║
// ╚══════════════════════════════════════════════╝

const axios       = require('axios')
const fs          = require('fs-extra')
const path        = require('path')
const { Sticker, StickerTypes } = require('wa-sticker-formatter')
const config      = require('../config')
const { getContentType } = require('@whiskeysockets/baileys')

// ── STICKER ──────────────────────────────────────
async function sticker(sock, msg, from, args, ctx) {
  const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
  const qType  = quoted ? getContentType(quoted) : null

  let mediaMsg = null
  if (qType === 'imageMessage') mediaMsg = { imageMessage: quoted.imageMessage }
  else if (qType === 'videoMessage') mediaMsg = { videoMessage: quoted.videoMessage }
  else if (ctx.msgType === 'imageMessage') mediaMsg = msg
  else if (ctx.msgType === 'videoMessage') mediaMsg = msg

  if (!mediaMsg) return ctx.reply(`❓ Envoyez une image/vidéo avec *${config.PREFIX}sticker* ou en réponse à une image/vidéo.`)

  await ctx.react('⏳')
  try {
    const buffer = await sock.downloadMediaMessage(mediaMsg)
    const stickerBuf = await new Sticker(buffer, {
      pack : 'IB-HEX-BOT',
      author: 'Ib-Sacko™',
      type : StickerTypes.FULL,
      quality: 70
    }).toBuffer()
    await sock.sendMessage(from, { sticker: stickerBuf }, { quoted: msg })
  } catch (e) {
    await ctx.reply(`❌ Impossible de créer le sticker : ${e.message}`)
  }
}

// ── TOIMAGE (sticker → image) ─────────────────────
async function toimage(sock, msg, from, args, ctx) {
  const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
  if (!quoted?.stickerMessage) return ctx.reply(`❓ Répondez à un sticker avec *${config.PREFIX}toimage*`)

  await ctx.react('⏳')
  try {
    const qMsg = { message: quoted, key: { remoteJid: from } }
    const buf  = await sock.downloadMediaMessage(qMsg)
    await sock.sendMessage(from, { image: buf, caption: '✅ Sticker converti en image !' }, { quoted: msg })
  } catch (e) {
    await ctx.reply(`❌ Erreur : ${e.message}`)
  }
}

// ── ATTP (texte animé en sticker) ─────────────────
async function attp(sock, msg, from, args, ctx) {
  const text = args.join(' ')
  if (!text) return ctx.reply(`❓ Usage : *${config.PREFIX}attp [texte]*`)

  await ctx.react('⏳')
  try {
    const res = await axios.get(`https://api.lolhuman.xyz/api/attp?text=${encodeURIComponent(text)}&apikey=public`, {
      responseType: 'arraybuffer', timeout: 15000
    })
    await sock.sendMessage(from, { sticker: Buffer.from(res.data) }, { quoted: msg })
  } catch {
    try {
      const r2 = await axios.get(`https://bk9.fun/sticker/attp?text=${encodeURIComponent(text)}`, {
        responseType: 'arraybuffer', timeout: 15000
      })
      await sock.sendMessage(from, { sticker: Buffer.from(r2.data) }, { quoted: msg })
    } catch (e) {
      await ctx.reply(`❌ Service ATTP indisponible : ${e.message}`)
    }
  }
}

// ── MP3 (télécharger audio YouTube) ───────────────
async function mp3(sock, msg, from, args, ctx) {
  const query = args.join(' ')
  if (!query) return ctx.reply(`❓ Usage : *${config.PREFIX}mp3 [titre de la chanson]*`)

  await ctx.react('⏳')
  try {
    // Chercher via API publique
    const searchRes = await axios.get(`https://youtube-mp36.p.rapidapi.com/`, {
      params: { q: query },
      headers: {
        'X-RapidAPI-Key': 'SIGN-UP-FOR-KEY',
        'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
      }
    })
    // Fallback: api publique sans clé
    throw new Error('Utilisation du fallback')
  } catch {
    try {
      const res = await axios.get(`https://api.lolhuman.xyz/api/youtube/search?q=${encodeURIComponent(query)}&apikey=public`, { timeout: 10000 })
      const vid  = res.data?.result?.[0]
      if (!vid) return ctx.reply('❌ Aucun résultat trouvé.')
      const dlRes = await axios.get(`https://api.lolhuman.xyz/api/youtube/mp3?url=${encodeURIComponent(vid.url)}&apikey=public`, { timeout: 30000 })
      const link = dlRes.data?.result
      if (!link) return ctx.reply('❌ Impossible de télécharger.')
      await sock.sendMessage(from, {
        audio: { url: link },
        mimetype: 'audio/mpeg',
        ptt: false,
        fileName: `${vid.title || query}.mp3`
      }, { quoted: msg })
    } catch (e) {
      await ctx.reply(`❌ Erreur MP3 : ${e.message}\n_Vérifiez votre connexion._`)
    }
  }
}

// ── FANCY (texte stylé) ───────────────────────────
async function fancy(sock, msg, from, args, ctx) {
  const text = args.join(' ')
  if (!text) return ctx.reply(`❓ Usage : *${config.PREFIX}fancy [texte]*`)

  const styles = [
    text.split('').map(c => {
      const a = 'abcdefghijklmnopqrstuvwxyz'
      const b = '𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇'
      const i = a.indexOf(c.toLowerCase())
      return i >= 0 ? b[i] : c
    }).join(''),
    text.split('').map(c => {
      const a = 'abcdefghijklmnopqrstuvwxyz'
      const b = '𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏'
      const i = a.indexOf(c.toLowerCase())
      return i >= 0 ? b[i] : c
    }).join(''),
    text.toUpperCase().split('').map(c => {
      const a = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      const b = '🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩'
      const i = a.indexOf(c)
      return i >= 0 ? b[i] : c
    }).join(''),
    text.split('').join(' '),
    `꧁${text}꧂`,
  ]

  const resp = styles.map((s, i) => `${i + 1}. ${s}`).join('\n')
  await ctx.reply(`✨ *Texte Stylé — IB-HEX-BOT*\n\n${resp}`)
}

// ── SS (capture d'écran) ──────────────────────────
async function ss(sock, msg, from, args, ctx) {
  const url = args[0]
  if (!url || !url.startsWith('http')) return ctx.reply(`❓ Usage : *${config.PREFIX}ss [URL]*\nExemple : ${config.PREFIX}ss https://google.com`)

  await ctx.react('⏳')
  try {
    const apiUrl = `https://api.screenshotmachine.com?key=c9fca3&url=${encodeURIComponent(url)}&dimension=1366x768&device=desktop&format=jpg&cacheLimit=0`
    const res = await axios.get(apiUrl, { responseType: 'arraybuffer', timeout: 20000 })
    await sock.sendMessage(from, {
      image: Buffer.from(res.data),
      caption: `📸 Capture de : ${url}`
    }, { quoted: msg })
  } catch {
    try {
      const r2 = await axios.get(`https://api.lolhuman.xyz/api/screenshot?url=${encodeURIComponent(url)}&apikey=public`, {
        responseType: 'arraybuffer', timeout: 20000
      })
      await sock.sendMessage(from, {
        image: Buffer.from(r2.data),
        caption: `📸 Capture de : ${url}`
      }, { quoted: msg })
    } catch (e) {
      await ctx.reply(`❌ Impossible de capturer la page : ${e.message}`)
    }
  }
}

// ── URL (raccourcir lien) ─────────────────────────
async function url(sock, msg, from, args, ctx) {
  const link = args[0]
  if (!link || !link.startsWith('http')) return ctx.reply(`❓ Usage : *${config.PREFIX}url [lien]*`)

  await ctx.react('⏳')
  try {
    const res = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(link)}`, { timeout: 10000 })
    await ctx.reply(`🔗 *Lien raccourci :*\n${res.data}`)
  } catch (e) {
    await ctx.reply(`❌ Impossible de raccourcir : ${e.message}`)
  }
}

// ── TAKE (récupérer sticker depuis image) ────────
async function take(sock, msg, from, args, ctx) {
  const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
  if (!quoted?.stickerMessage) return ctx.reply(`❓ Répondez à un sticker avec *${config.PREFIX}take [pack] | [auteur]*`)

  const parts  = args.join(' ').split('|')
  const pack   = parts[0]?.trim() || 'IB-HEX-BOT'
  const author = parts[1]?.trim() || 'Ib-Sacko™'

  await ctx.react('⏳')
  try {
    const qMsg = { message: quoted, key: { remoteJid: from } }
    const buf  = await sock.downloadMediaMessage(qMsg)
    const stickerBuf = await new Sticker(buf, {
      pack, author,
      type: StickerTypes.FULL,
      quality: 70
    }).toBuffer()
    await sock.sendMessage(from, { sticker: stickerBuf }, { quoted: msg })
  } catch (e) {
    await ctx.reply(`❌ Erreur : ${e.message}`)
  }
}

// ── GIMAGES (image Google) ─────────────────────────
async function gimages(sock, msg, from, args, ctx) {
  const query = args.join(' ')
  if (!query) return ctx.reply(`❓ Usage : *${config.PREFIX}gimages [recherche]*`)

  await ctx.react('⏳')
  try {
    const res = await axios.get(`https://api.lolhuman.xyz/api/googleimage?text=${encodeURIComponent(query)}&apikey=public`, { timeout: 10000 })
    const imgs = res.data?.result?.slice(0, 3) || []
    if (!imgs.length) return ctx.reply('❌ Aucune image trouvée.')
    for (const imgUrl of imgs) {
      await sock.sendMessage(from, { image: { url: imgUrl }, caption: `🖼️ ${query}` }, { quoted: msg })
    }
  } catch (e) {
    await ctx.reply(`❌ Erreur image : ${e.message}`)
  }
}

module.exports = { sticker, toimage, attp, mp3, fancy, ss, url, take, gimages }

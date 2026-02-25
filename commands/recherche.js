// ╔══════════════════════════════════════════════╗
// ║   IB-HEX-BOT — commands/recherche.js        ║
// ╚══════════════════════════════════════════════╝

const axios  = require('axios')
const config = require('../config')

// ── GOOGLE ──────────────────────────────────────
async function google(sock, msg, from, args, ctx) {
  const query = args.join(' ')
  if (!query) return ctx.reply(`❓ Usage : *${config.PREFIX}google [recherche]*`)

  await ctx.react('🔍')
  try {
    const res = await axios.get(
      `https://api.lolhuman.xyz/api/google?text=${encodeURIComponent(query)}&apikey=public`,
      { timeout: 10000 }
    )
    const results = res.data?.result?.slice(0, 4) || []
    if (!results.length) return ctx.reply('❌ Aucun résultat.')
    let text = `🔍 *Google — ${query}*\n\n`
    results.forEach((r, i) => {
      text += `*${i + 1}.* ${r.title}\n${r.link}\n${r.snippet || ''}\n\n`
    })
    await ctx.reply(text.trim())
  } catch (e) {
    await ctx.reply(`❌ Erreur recherche : ${e.message}`)
  }
}

// ── IMAGE ──────────────────────────────────────
async function image(sock, msg, from, args, ctx) {
  const query = args.join(' ')
  if (!query) return ctx.reply(`❓ Usage : *${config.PREFIX}image [recherche]*`)
  await ctx.react('🔍')
  try {
    const res = await axios.get(`https://api.lolhuman.xyz/api/googleimage?text=${encodeURIComponent(query)}&apikey=public`, { timeout: 10000 })
    const imgs = res.data?.result?.slice(0, 3) || []
    if (!imgs.length) return ctx.reply('❌ Aucune image trouvée.')
    for (const url of imgs) {
      await sock.sendMessage(from, { image: { url }, caption: `🖼️ ${query}` }, { quoted: msg })
    }
  } catch (e) {
    await ctx.reply(`❌ Erreur : ${e.message}`)
  }
}

// ── VIDEO ───────────────────────────────────────
async function video(sock, msg, from, args, ctx) {
  const query = args.join(' ')
  if (!query) return ctx.reply(`❓ Usage : *${config.PREFIX}video [titre]*`)

  await ctx.react('🔍')
  try {
    const res = await axios.get(`https://api.lolhuman.xyz/api/youtube/search?q=${encodeURIComponent(query)}&apikey=public`, { timeout: 10000 })
    const results = res.data?.result?.slice(0, 5) || []
    if (!results.length) return ctx.reply('❌ Aucun résultat.')
    let text = `🎬 *Résultats YouTube — ${query}*\n\n`
    results.forEach((v, i) => {
      text += `*${i + 1}.* ${v.title}\n⏱ ${v.duration || '?'} | 👁 ${v.views || '?'}\n🔗 ${v.url}\n\n`
    })
    await ctx.reply(text.trim())
  } catch (e) {
    await ctx.reply(`❌ Erreur : ${e.message}`)
  }
}

// ── SONG (recherche + téléchargement) ─────────────
async function song(sock, msg, from, args, ctx) {
  const query = args.join(' ')
  if (!query) return ctx.reply(`❓ Usage : *${config.PREFIX}song [titre - artiste]*`)

  await ctx.react('⏳')
  try {
    const res = await axios.get(`https://api.lolhuman.xyz/api/youtube/search?q=${encodeURIComponent(query)}&apikey=public`, { timeout: 10000 })
    const vid  = res.data?.result?.[0]
    if (!vid) return ctx.reply('❌ Musique non trouvée.')

    await ctx.reply(`🎵 Téléchargement : *${vid.title}*…`)
    const dlRes = await axios.get(`https://api.lolhuman.xyz/api/youtube/mp3?url=${encodeURIComponent(vid.url)}&apikey=public`, { timeout: 30000 })
    const link  = dlRes.data?.result
    if (!link) return ctx.reply('❌ Impossible de télécharger.')

    await sock.sendMessage(from, {
      audio: { url: link },
      mimetype: 'audio/mpeg',
      ptt: false,
      fileName: `${vid.title}.mp3`
    }, { quoted: msg })
  } catch (e) {
    await ctx.reply(`❌ Erreur musique : ${e.message}`)
  }
}

// ── TIKTOK ─────────────────────────────────────
async function tiktok(sock, msg, from, args, ctx) {
  const url = args[0]
  if (!url || !url.includes('tiktok')) return ctx.reply(`❓ Usage : *${config.PREFIX}tiktok [lien TikTok]*`)

  await ctx.react('⏳')
  try {
    const res = await axios.get(`https://api.lolhuman.xyz/api/tiktok?url=${encodeURIComponent(url)}&apikey=public`, { timeout: 20000 })
    const data = res.data?.result
    if (!data?.nowm) return ctx.reply('❌ Impossible de télécharger cette vidéo.')
    await sock.sendMessage(from, {
      video: { url: data.nowm },
      caption: `🎵 *${data.title || 'TikTok'}*\n👤 ${data.author || ''}\n❤️ ${data.likes || 0} likes\n_Propulsé par IB-HEX-BOT 🥷_`
    }, { quoted: msg })
  } catch {
    try {
      const r2 = await axios.get(`https://tikwm.com/api/?url=${encodeURIComponent(url)}`, { timeout: 20000 })
      const d2  = r2.data?.data
      if (!d2?.play) return ctx.reply('❌ Lien invalide ou privé.')
      await sock.sendMessage(from, {
        video: { url: d2.play },
        caption: `🎵 *${d2.title || 'TikTok'}*\n_IB-HEX-BOT 🥷_`
      }, { quoted: msg })
    } catch (e) {
      await ctx.reply(`❌ Erreur TikTok : ${e.message}`)
    }
  }
}

// ── INSTAGRAM ───────────────────────────────────
async function instagram(sock, msg, from, args, ctx) {
  const url = args[0]
  if (!url || !url.includes('instagram')) return ctx.reply(`❓ Usage : *${config.PREFIX}instagram [lien]*`)

  await ctx.react('⏳')
  try {
    const res = await axios.get(`https://api.lolhuman.xyz/api/instagram?url=${encodeURIComponent(url)}&apikey=public`, { timeout: 20000 })
    const data = res.data?.result
    if (!data) return ctx.reply('❌ Impossible de télécharger.')
    const mediaUrl = Array.isArray(data) ? data[0] : data
    await sock.sendMessage(from, {
      video: { url: mediaUrl },
      caption: `📸 *Instagram*\n_IB-HEX-BOT 🥷_`
    }, { quoted: msg })
  } catch (e) {
    await ctx.reply(`❌ Erreur Instagram : ${e.message}`)
  }
}

// ── FACEBOOK ────────────────────────────────────
async function facebook(sock, msg, from, args, ctx) {
  const url = args[0]
  if (!url || !url.includes('facebook')) return ctx.reply(`❓ Usage : *${config.PREFIX}facebook [lien]*`)

  await ctx.react('⏳')
  try {
    const res = await axios.get(`https://api.lolhuman.xyz/api/facebook?url=${encodeURIComponent(url)}&apikey=public`, { timeout: 20000 })
    const data = res.data?.result
    if (!data) return ctx.reply('❌ Impossible de télécharger.')
    await sock.sendMessage(from, {
      video: { url: data.hd || data.sd },
      caption: `📘 *Facebook*\n_IB-HEX-BOT 🥷_`
    }, { quoted: msg })
  } catch (e) {
    await ctx.reply(`❌ Erreur Facebook : ${e.message}`)
  }
}

// ── PLAY (Play Store) ───────────────────────────
async function play(sock, msg, from, args, ctx) {
  const query = args.join(' ')
  if (!query) return ctx.reply(`❓ Usage : *${config.PREFIX}play [application]*`)

  await ctx.react('🔍')
  try {
    const res = await axios.get(`https://api.lolhuman.xyz/api/playstore?q=${encodeURIComponent(query)}&apikey=public`, { timeout: 10000 })
    const apps = res.data?.result?.slice(0, 3) || []
    if (!apps.length) return ctx.reply('❌ Application non trouvée.')
    for (const app of apps) {
      await sock.sendMessage(from, {
        image: { url: app.icon || config.MENU_IMAGE },
        caption: `📱 *${app.name}*\n⭐ Note : ${app.score || '?'}\n💾 Téléchargements : ${app.installs || '?'}\n📂 Catégorie : ${app.genre || '?'}\n\n📝 ${app.summary || ''}\n\n🔗 ${app.url}`
      }, { quoted: msg })
    }
  } catch (e) {
    await ctx.reply(`❌ Erreur Play Store : ${e.message}`)
  }
}

// ── MEDIAFIRE ───────────────────────────────────
async function mediafire(sock, msg, from, args, ctx) {
  const url = args[0]
  if (!url || !url.includes('mediafire')) return ctx.reply(`❓ Usage : *${config.PREFIX}mediafire [lien MediaFire]*`)

  await ctx.react('⏳')
  try {
    const res = await axios.get(`https://api.lolhuman.xyz/api/mediafire?url=${encodeURIComponent(url)}&apikey=public`, { timeout: 15000 })
    const data = res.data?.result
    if (!data?.link) return ctx.reply('❌ Impossible d\'obtenir le lien.')
    await ctx.reply(`📁 *MediaFire*\n\n📄 Fichier : ${data.name}\n📦 Taille : ${data.size}\n\n🔗 Lien direct :\n${data.link}`)
  } catch (e) {
    await ctx.reply(`❌ Erreur MediaFire : ${e.message}`)
  }
}

// ── LYRICS ──────────────────────────────────────
async function lyrics(sock, msg, from, args, ctx) {
  const query = args.join(' ')
  if (!query) return ctx.reply(`❓ Usage : *${config.PREFIX}lyrics [titre - artiste]*`)

  await ctx.react('🎵')
  try {
    const res = await axios.get(`https://api.lolhuman.xyz/api/lyrics?title=${encodeURIComponent(query)}&apikey=public`, { timeout: 10000 })
    const data = res.data?.result
    if (!data?.lyrics) return ctx.reply('❌ Paroles non trouvées.')
    const text = `🎵 *${data.title}*\n👤 ${data.artist}\n\n${data.lyrics.slice(0, 3500)}`
    await ctx.reply(text)
  } catch {
    try {
      const r2 = await axios.get(`https://some-random-api.com/lyrics?title=${encodeURIComponent(query)}`, { timeout: 10000 })
      const d2  = r2.data
      if (!d2?.lyrics) return ctx.reply('❌ Paroles non trouvées.')
      await ctx.reply(`🎵 *${d2.title}*\n👤 ${d2.author}\n\n${d2.lyrics.slice(0, 3500)}`)
    } catch (e) {
      await ctx.reply(`❌ Erreur paroles : ${e.message}`)
    }
  }
}

module.exports = { google, image, video, song, tiktok, instagram, facebook, play, mediafire, lyrics }

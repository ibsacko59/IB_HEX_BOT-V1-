// ╔══════════════════════════════════════════════╗
// ║   IB-HEX-BOT — commands/reactions.js        ║
// ╚══════════════════════════════════════════════╝

const axios  = require('axios')
const config = require('../config')

async function sendReaction(sock, msg, from, args, ctx, type, fr_label) {
  const quoted = msg.message?.extendedTextMessage?.contextInfo
  let target   = args[0]?.replace(/[^0-9]/g, '')
  if (!target && quoted?.participant) target = quoted.participant.replace(/[^0-9]/g, '')

  const gif_url = config.REACTION_GIFS[type]
  const sender  = ctx.senderNum

  await ctx.react('⏳')
  try {
    let gifBuffer = null
    try {
      const res = await axios.get(gif_url, { responseType: 'arraybuffer', timeout: 10000 })
      gifBuffer = Buffer.from(res.data)
    } catch {}

    const caption = target
      ? `🥷 *@${sender}* ${fr_label} *@${target}* !\n_IB-HEX-BOT 🥷_`
      : `🥷 *@${sender}* ${fr_label} !\n_IB-HEX-BOT 🥷_`

    const mentions = [ctx.sender]
    if (target) mentions.push(`${target}@s.whatsapp.net`)

    if (gifBuffer) {
      await sock.sendMessage(from, {
        video: gifBuffer,
        gifPlayback: true,
        caption,
        mentions
      }, { quoted: msg })
    } else {
      // Fallback: nekos.best API
      const fallbackMap = {
        yeet: 'throw', slap: 'slap', nom: 'bite',
        poke: 'poke', wave: 'wave', smile: 'smile',
        dance: 'dance', smug: 'smug', cringe: 'blush',
        happy: 'happy'
      }
      const nType = fallbackMap[type] || type
      const r2 = await axios.get(`https://nekos.best/api/v2/${nType}`, { timeout: 10000 })
      const imgUrl = r2.data?.results?.[0]?.url
      if (imgUrl) {
        await sock.sendMessage(from, {
          image: { url: imgUrl },
          caption,
          mentions
        }, { quoted: msg })
      } else {
        await sock.sendMessage(from, { text: caption, mentions }, { quoted: msg })
      }
    }
  } catch (e) {
    await ctx.reply(`${fr_label.toUpperCase()} 🥷\n_${e.message}_`)
  }
}

async function yeet  (s,m,f,a,c) { await sendReaction(s,m,f,a,c,'yeet','jette') }
async function slap  (s,m,f,a,c) { await sendReaction(s,m,f,a,c,'slap','gifle') }
async function nom   (s,m,f,a,c) { await sendReaction(s,m,f,a,c,'nom','mange') }
async function poke  (s,m,f,a,c) { await sendReaction(s,m,f,a,c,'poke','touche') }
async function wave  (s,m,f,a,c) { await sendReaction(s,m,f,a,c,'wave','salue') }
async function smile (s,m,f,a,c) { await sendReaction(s,m,f,a,c,'smile','sourit à') }
async function dance (s,m,f,a,c) { await sendReaction(s,m,f,a,c,'dance','danse pour') }
async function smug  (s,m,f,a,c) { await sendReaction(s,m,f,a,c,'smug','sourit narquoisement à') }
async function cringe(s,m,f,a,c) { await sendReaction(s,m,f,a,c,'cringe','fait frissonner') }
async function happy (s,m,f,a,c) { await sendReaction(s,m,f,a,c,'happy','est heureux avec') }

module.exports = { yeet, slap, nom, poke, wave, smile, dance, smug, cringe, happy }

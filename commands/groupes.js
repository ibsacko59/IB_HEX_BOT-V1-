// ╔══════════════════════════════════════════════╗
// ║   IB-HEX-BOT — commands/groupes.js          ║
// ╚══════════════════════════════════════════════╝

const config = require('../config')
const fs     = require('fs-extra')

function requireGroup(ctx) {
  if (!ctx.isGroup) { ctx.reply('❌ Cette commande fonctionne uniquement dans les groupes !'); return false }
  return true
}
async function isAdmin(sock, groupId, jid) {
  try {
    const meta = await sock.groupMetadata(groupId)
    return meta.participants.some(p => p.id === jid && (p.admin === 'admin' || p.admin === 'superadmin'))
  } catch { return false }
}

// ── KICKALL ─────────────────────────────────────
async function kickall(sock, msg, from, args, ctx) {
  if (!requireGroup(ctx)) return
  const meta    = await sock.groupMetadata(from)
  const botId   = sock.user.id.replace(/:\d+/, '') + '@s.whatsapp.net'
  const members = meta.participants.filter(p => p.id !== botId && p.id !== `${config.OWNER_NUMBER}@s.whatsapp.net`)
  if (!members.length) return ctx.reply('❌ Aucun membre à exclure.')
  await ctx.reply(`⚠️ Exclusion de ${members.length} membres en cours…`)
  for (const m of members) {
    try { await sock.groupParticipantsUpdate(from, [m.id], 'remove') } catch {}
    await new Promise(r => setTimeout(r, 500))
  }
  await ctx.reply('✅ Tous les membres ont été exclus.')
}

// ── TAGADMIN ─────────────────────────────────────
async function tagadmin(sock, msg, from, args, ctx) {
  if (!requireGroup(ctx)) return
  const meta    = await sock.groupMetadata(from)
  const admins  = meta.participants.filter(p => p.admin)
  if (!admins.length) return ctx.reply('❌ Aucun admin trouvé.')
  const mentions = admins.map(a => a.id)
  const text = `📢 *Mention Admins — IB-HEX-BOT*\n\n${args.join(' ') || '⚠️ Message des admins'}\n\n${admins.map(a => `@${a.id.replace('@s.whatsapp.net','')} 👑`).join('\n')}`
  await sock.sendMessage(from, { text, mentions }, { quoted: msg })
}

// ── ACCEPTALL ────────────────────────────────────
async function acceptall(sock, msg, from, args, ctx) {
  if (!requireGroup(ctx)) return
  try {
    await sock.groupRequestParticipantsList(from)
    const requests = await sock.groupRequestParticipantsList(from)
    if (!requests?.length) return ctx.reply('❌ Aucune demande en attente.')
    for (const req of requests) {
      try { await sock.groupRequestParticipantsUpdate(from, [req.jid], 'approve') } catch {}
    }
    await ctx.reply(`✅ ${requests.length} demande(s) acceptée(s) !`)
  } catch (e) {
    await ctx.reply(`❌ Erreur : ${e.message}`)
  }
}

// ── TAGALL ───────────────────────────────────────
async function tagall(sock, msg, from, args, ctx) {
  if (!requireGroup(ctx)) return
  const meta     = await sock.groupMetadata(from)
  const members  = meta.participants
  const mentions = members.map(m => m.id)
  const text     = `📢 *${args.join(' ') || 'Attention tout le monde!'}*\n\n${members.map(m => `@${m.id.replace('@s.whatsapp.net','')}`).join(' ')}`
  await sock.sendMessage(from, { text, mentions }, { quoted: msg })
}

// ── GETALL (liste membres) ────────────────────────
async function getall(sock, msg, from, args, ctx) {
  if (!requireGroup(ctx)) return
  const meta    = await sock.groupMetadata(from)
  const members = meta.participants
  let text = `👥 *Membres du groupe* (${members.length})\n\n`
  members.forEach((m, i) => {
    text += `${i+1}. +${m.id.replace('@s.whatsapp.net','')} ${m.admin ? '👑' : ''}\n`
  })
  await ctx.reply(text)
}

// ── GROUP CLOSE / OPEN ────────────────────────────
async function groupclose(sock, msg, from, args, ctx) {
  if (!requireGroup(ctx)) return
  try {
    await sock.groupSettingUpdate(from, 'announcement')
    await ctx.reply('🔒 Groupe *fermé* — seuls les admins peuvent écrire.')
  } catch (e) { ctx.reply(`❌ ${e.message}`) }
}
async function groupopen(sock, msg, from, args, ctx) {
  if (!requireGroup(ctx)) return
  try {
    await sock.groupSettingUpdate(from, 'not_announcement')
    await ctx.reply('🔓 Groupe *ouvert* — tout le monde peut écrire.')
  } catch (e) { ctx.reply(`❌ ${e.message}`) }
}

// ── ADD ──────────────────────────────────────────
async function add(sock, msg, from, args, ctx) {
  if (!requireGroup(ctx)) return
  const num = args[0]?.replace(/[^0-9]/g, '')
  if (!num) return ctx.reply(`❓ Usage : *${config.PREFIX}add [numéro]*`)
  const jid = `${num}@s.whatsapp.net`
  try {
    await sock.groupParticipantsUpdate(from, [jid], 'add')
    await ctx.reply(`✅ @${num} a été ajouté !`)
  } catch (e) { ctx.reply(`❌ Impossible d'ajouter : ${e.message}`) }
}

// ── VCF ─────────────────────────────────────────
async function vcf(sock, msg, from, args, ctx) {
  if (!requireGroup(ctx)) return
  const meta    = await sock.groupMetadata(from)
  const members = meta.participants
  let vcfContent = ''
  members.forEach((m) => {
    const num = m.id.replace('@s.whatsapp.net', '')
    vcfContent += `BEGIN:VCARD\nVERSION:3.0\nFN:+${num}\nTEL;TYPE=CELL:+${num}\nEND:VCARD\n`
  })
  const buf = Buffer.from(vcfContent, 'utf-8')
  await sock.sendMessage(from, {
    document: buf,
    mimetype: 'text/x-vcard',
    fileName: `${meta.subject || 'groupe'}.vcf`
  }, { quoted: msg })
}

// ── LINKGC ──────────────────────────────────────
async function linkgc(sock, msg, from, args, ctx) {
  if (!requireGroup(ctx)) return
  try {
    const code = await sock.groupInviteCode(from)
    await ctx.reply(`🔗 *Lien du groupe :*\nhttps://chat.whatsapp.com/${code}`)
  } catch (e) { ctx.reply(`❌ ${e.message}`) }
}

// ── ANTILINK ────────────────────────────────────
async function antilink(sock, msg, from, args, ctx) {
  if (!requireGroup(ctx)) return
  const toggle = args[0]?.toLowerCase()
  if (!toggle || !['on', 'off'].includes(toggle))
    return ctx.reply(`❓ Usage : *${config.PREFIX}antilink on/off*`)
  config.FEATURES.ANTI_LINK = toggle === 'on'
  await ctx.reply(`🔗 Anti-lien *${toggle === 'on' ? 'activé ✅' : 'désactivé ❌'}*`)
}

// ── ANTISTICKER ─────────────────────────────────
async function antisticker(sock, msg, from, args, ctx) {
  if (!requireGroup(ctx)) return
  const toggle = args[0]?.toLowerCase()
  if (!toggle || !['on', 'off'].includes(toggle))
    return ctx.reply(`❓ Usage : *${config.PREFIX}antisticker on/off*`)
  config.FEATURES.ANTI_STICKER = toggle === 'on'
  await ctx.reply(`🚫 Anti-sticker *${toggle === 'on' ? 'activé ✅' : 'désactivé ❌'}*`)
}

// ── ANTIGM ──────────────────────────────────────
async function antigm(sock, msg, from, args, ctx) {
  if (!requireGroup(ctx)) return
  const toggle = args[0]?.toLowerCase()
  if (!toggle || !['on', 'off'].includes(toggle))
    return ctx.reply(`❓ Usage : *${config.PREFIX}antigm on/off*`)
  config.FEATURES.ANTI_GM = toggle === 'on'
  await ctx.reply(`📢 Anti-mention *${toggle === 'on' ? 'activé ✅' : 'désactivé ❌'}*`)
}

// ── ANTIDELETE ───────────────────────────────────
async function antidelete(sock, msg, from, args, ctx) {
  const toggle = args[0]?.toLowerCase()
  if (!toggle || !['on', 'off'].includes(toggle))
    return ctx.reply(`❓ Usage : *${config.PREFIX}antidelete on/off*`)
  config.FEATURES.ANTI_DELETE = toggle === 'on'
  await ctx.reply(`🗑️ Anti-suppression *${toggle === 'on' ? 'activé ✅' : 'désactivé ❌'}*`)
}

// ── CREATE ───────────────────────────────────────
async function create(sock, msg, from, args, ctx) {
  const groupName = args.join(' ')
  if (!groupName) return ctx.reply(`❓ Usage : *${config.PREFIX}create [nom du groupe]*`)
  try {
    const group = await sock.groupCreate(groupName, [`${config.OWNER_NUMBER}@s.whatsapp.net`])
    await ctx.reply(`✅ Groupe *${groupName}* créé !\nID : ${group.id}`)
  } catch (e) { ctx.reply(`❌ ${e.message}`) }
}

// ── GROUPINFO ────────────────────────────────────
async function groupinfo(sock, msg, from, args, ctx) {
  if (!requireGroup(ctx)) return
  try {
    const meta = await sock.groupMetadata(from)
    const admins = meta.participants.filter(p => p.admin).length
    const code   = await sock.groupInviteCode(from).catch(() => '?')
    await ctx.reply(
      `📋 *Infos du groupe*\n\n` +
      `📌 Nom : ${meta.subject}\n` +
      `🆔 ID : ${meta.id}\n` +
      `👥 Membres : ${meta.participants.length}\n` +
      `👑 Admins : ${admins}\n` +
      `📅 Créé le : ${new Date(meta.creation * 1000).toLocaleDateString('fr-FR')}\n` +
      `📝 Description : ${meta.desc || 'Aucune'}\n` +
      `🔗 Lien : https://chat.whatsapp.com/${code}`
    )
  } catch (e) { ctx.reply(`❌ ${e.message}`) }
}

// ── JOIN ─────────────────────────────────────────
async function join(sock, msg, from, args, ctx) {
  const link = args[0]
  if (!link || !link.includes('chat.whatsapp.com')) return ctx.reply(`❓ Usage : *${config.PREFIX}join [lien du groupe]*`)
  const code = link.split('chat.whatsapp.com/')[1]
  try {
    await sock.groupAcceptInvite(code)
    await ctx.reply('✅ Groupe rejoint !')
  } catch (e) { ctx.reply(`❌ Impossible de rejoindre : ${e.message}`) }
}

// ── LEAVE ─────────────────────────────────────────
async function leave(sock, msg, from, args, ctx) {
  if (!requireGroup(ctx)) return
  await ctx.reply('👋 Au revoir ! *IB-HEX-BOT* quitte le groupe.')
  await new Promise(r => setTimeout(r, 1500))
  try { await sock.groupLeave(from) } catch (e) { ctx.reply(`❌ ${e.message}`) }
}

// ── DELETE ───────────────────────────────────────
async function deletemsg(sock, msg, from, args, ctx) {
  const quoted = msg.message?.extendedTextMessage?.contextInfo?.stanzaId
  if (!quoted) return ctx.reply(`❓ Répondez au message à supprimer avec *${config.PREFIX}delete*`)
  try {
    await sock.sendMessage(from, { delete: { remoteJid: from, id: quoted, participant: msg.message.extendedTextMessage.contextInfo.participant } })
    await ctx.react('✅')
  } catch (e) { ctx.reply(`❌ ${e.message}`) }
}

// ── UPLOAD ───────────────────────────────────────
async function upload(sock, msg, from, args, ctx) {
  const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
  if (!quoted) return ctx.reply(`❓ Répondez à un média avec *${config.PREFIX}upload*`)
  await ctx.react('⏳')
  try {
    const qMsg = { message: quoted, key: { remoteJid: from } }
    const buf  = await sock.downloadMediaMessage(qMsg)
    await ctx.reply(`✅ Média récupéré avec succès !\n📦 Taille : ${(buf.length / 1024).toFixed(2)} Ko`)
  } catch (e) { ctx.reply(`❌ ${e.message}`) }
}

// ── VV (voir vues uniques) ─────────────────────
async function vv(sock, msg, from, args, ctx) {
  const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
  if (!quoted) return ctx.reply(`❓ Répondez à un message vue unique avec *${config.PREFIX}vv*`)
  const { getContentType } = require('@whiskeysockets/baileys')
  const qType = getContentType(quoted)
  const inner = quoted[qType]
  const privateJid = `${ctx.senderNum}@s.whatsapp.net`
  try {
    if (qType === 'imageMessage') {
      await sock.sendMessage(privateJid, { image: { url: inner.url }, caption: '🥷 Vue unique récupérée' })
    } else if (qType === 'videoMessage') {
      await sock.sendMessage(privateJid, { video: { url: inner.url }, caption: '🥷 Vue unique récupérée' })
    } else {
      return ctx.reply('❌ Ce message ne contient pas d\'image ou vidéo.')
    }
    await ctx.reply('✅ Envoyé dans votre privé !')
  } catch (e) { ctx.reply(`❌ ${e.message}`) }
}

module.exports = {
  kickall, tagadmin, acceptall, tagall, getall,
  groupclose, groupopen, add, vcf, linkgc,
  antilink, antisticker, antigm, antidelete,
  create, groupinfo, join, leave,
  delete: deletemsg, upload, vv
}

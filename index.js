// ╔══════════════════════════════════════════════════════════╗
// ║            IB-HEX-BOT  —  index.js (CORE)               ║
// ║         Développé par Ibrahima Sory Sacko                ║
// ╚══════════════════════════════════════════════════════════╝

  const baileys = require('@whiskeysockets/baileys')

const makeWASocket = baileys.default
const {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  jidDecode,
  proto,
  getContentType,
  generateWAMessageFromContent,
  prepareWAMessageMedia,
} 

const pino    = require('pino')
const { Boom } = require('@hapi/boom')
const fs      = require('fs-extra')
const path    = require('path')
const qrcode  = require('qrcode')
const express = require('express')
const http    = require('http')
const { Server } = require('socket.io')
const config  = require('./config')

// ── Serveur Web (QR Code) ───────────────────────────────────
const app     = express()
const server  = http.createServer(app)
const io      = new Server(server)

app.use(express.static(path.join(__dirname, 'web')))
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'index.html'))
})

// ── Store en mémoire ────────────────────────────────────────
const store = makeInMemoryStore({
  logger: pino({ level: 'silent' })
})

// ── Charger toutes les commandes ────────────────────────────
const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js'))
const commands     = {}

for (const file of commandFiles) {
  const cmds = require(`./commands/${file}`)
  for (const [name, fn] of Object.entries(cmds)) {
    commands[name.toLowerCase()] = fn
  }
}

// ── Démarrage du bot ────────────────────────────────────────
let qrImageData = null
let isConnected = false

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(config.SESSION_DIR)
  const { version }          = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: true,
    auth: state,
    browser: ['IB-HEX-BOT', 'Chrome', '1.0'],
    getMessage: async (key) => {
      if (store) {
        const msg = await store.loadMessage(key.remoteJid, key.id)
        return msg?.message || undefined
      }
      return { conversation: 'Bonjour' }
    }
  })

  store.bind(sock.ev)

  // ── QR Code ─────────────────────────────────────────────
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update

    if (qr) {
      console.log('\n🥷 QR Code reçu — scannez-le sur votre interface web!\n')
      qrImageData = await qrcode.toDataURL(qr)
      io.emit('qr', qrImageData)
      io.emit('status', { connected: false, message: '🔍 Scannez le QR Code' })
    }

    if (connection === 'close') {
      isConnected = false
      io.emit('status', { connected: false, message: '❌ Déconnecté' })
      const shouldReconnect =
        (lastDisconnect?.error instanceof Boom)
          ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
          : true
      console.log('❌ Connexion fermée — raison :', lastDisconnect?.error, '— Reconnexion :', shouldReconnect)
      if (shouldReconnect) {
        setTimeout(startBot, 3000)
      } else {
        console.log('⚠️ Session expirée. Supprimez le dossier session/ et relancez.')
        io.emit('status', { connected: false, message: '⚠️ Session expirée — supprimez /session et redémarrez' })
      }
    }

    if (connection === 'open') {
      isConnected  = true
      qrImageData  = null
      io.emit('connected', { message: '✅ Bot connecté !' })
      io.emit('status', { connected: true, message: '✅ IB-HEX-BOT est en ligne !' })
      console.log('\n✅ IB-HEX-BOT connecté avec succès !\n')
    }
  })

  // ── Sauvegarder les credentials ─────────────────────────
  sock.ev.on('creds.update', saveCreds)

  // ── Gestion des messages ─────────────────────────────────
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return

    for (const msg of messages) {
      try {
        await handleMessage(sock, msg)
      } catch (err) {
        console.error('❌ Erreur handleMessage :', err)
      }
    }
  })

  // ── Anti-delete ──────────────────────────────────────────
  sock.ev.on('messages.delete', async ({ keys }) => {
    if (!config.FEATURES.ANTI_DELETE) return
    for (const key of keys) {
      try {
        const msg = store.messages[key.remoteJid]?.get(key.id)
        if (!msg) continue
        const jid    = key.remoteJid
        const sender = key.participant || key.remoteJid
        const name   = sender.split('@')[0]
        await sock.sendMessage(jid, {
          text: `🚨 *Anti-Suppression IB-HEX-BOT*\n\n@${name} a supprimé un message.\n\n_Message récupéré 🥷_`,
          mentions: [sender]
        })
      } catch (e) { /* ignore */ }
    }
  })

  return sock
}

// ── Traitement des messages ──────────────────────────────────
async function handleMessage(sock, msg) {
  if (!msg.message) return
  if (msg.key.fromMe) return   // ignorer les messages du bot lui-même

  const from     = msg.key.remoteJid
  const isGroup  = from.endsWith('@g.us')
  const sender   = isGroup ? msg.key.participant : from
  const senderNum= sender?.replace(/[^0-9]/g, '')
  const msgType  = getContentType(msg.message)

  // ── Récupérer le texte du message ──────────────────────
  let body = ''
  if (msgType === 'conversation')          body = msg.message.conversation
  else if (msgType === 'extendedTextMessage') body = msg.message.extendedTextMessage.text
  else if (msgType === 'imageMessage')     body = msg.message.imageMessage.caption || ''
  else if (msgType === 'videoMessage')     body = msg.message.videoMessage.caption || ''
  else if (msgType === 'documentMessage')  body = msg.message.documentMessage.caption || ''
  else if (msgType === 'buttonsResponseMessage') body = msg.message.buttonsResponseMessage.selectedButtonId
  else if (msgType === 'listResponseMessage')    body = msg.message.listResponseMessage.singleSelectReply.selectedRowId
  else if (msgType === 'templateButtonReplyMessage') body = msg.message.templateButtonReplyMessage.selectedId

  // ── Commande 🥷 (Vue unique) ───────────────────────────
  if (msgType === 'viewOnceMessage' || msgType === 'viewOnceMessageV2' || msgType === 'viewOnceMessageV2Extension') {
    const vMsg   = msg.message[msgType]?.message || msg.message[msgType]
    const innerT = getContentType(vMsg)
    const inner  = vMsg[innerT]
    const privateJid = `${senderNum}@s.whatsapp.net`
    if (innerT === 'imageMessage') {
      await sock.sendMessage(privateJid, {
        image: { url: inner.url },
        mimetype: inner.mimetype,
        caption: '🥷 *IB-HEX-BOT* — Vue unique récupérée\n_Envoyée ici pour toi_ 👀'
      })
    } else if (innerT === 'videoMessage') {
      await sock.sendMessage(privateJid, {
        video: { url: inner.url },
        mimetype: inner.mimetype,
        caption: '🥷 *IB-HEX-BOT* — Vue unique récupérée\n_Envoyée ici pour toi_ 👀'
      })
    }
    return
  }

  // ── Vérifier le préfixe ────────────────────────────────
  const PREFIX = config.PREFIX
  if (!body.toLowerCase().startsWith(PREFIX.toLowerCase())) {
    // Chatbot si activé
    if (config.FEATURES.CHATBOT && !isGroup) {
      const { chatbot } = require('./commands/ia')
      await chatbot(sock, msg, from, [], { body })
    }
    return
  }

  // ── Parser la commande ─────────────────────────────────
  const withoutPrefix = body.slice(PREFIX.length).trim()
  const args          = withoutPrefix.split(/ +/)
  const command       = args.shift().toLowerCase()

  // ── Contexte passé aux commandes ──────────────────────
  const ctx = {
    from, isGroup, sender, senderNum,
    body, args, command, msg, msgType,
    config, sock, store,
    PREFIX,
    isOwner: senderNum === config.OWNER_NUMBER,
    reply: (text) => sock.sendMessage(from, { text }, { quoted: msg }),
    react: (emoji) => sock.sendMessage(from, { react: { text: emoji, key: msg.key } }),
  }

  // ── Anti-link ─────────────────────────────────────────
  if (config.FEATURES.ANTI_LINK && isGroup) {
    const linkRegex = /(https?:\/\/[^\s]+|chat\.whatsapp\.com\/[^\s]+)/gi
    if (linkRegex.test(body)) {
      try {
        await sock.groupParticipantsUpdate(from, [sender], 'remove')
        await sock.sendMessage(from, { text: `🚫 @${senderNum} a été retiré pour avoir envoyé un lien.`, mentions: [sender] })
      } catch (e) {}
      return
    }
  }

  // ── Anti-sticker ──────────────────────────────────────
  if (config.FEATURES.ANTI_STICKER && isGroup && msgType === 'stickerMessage') {
    try {
      await sock.groupParticipantsUpdate(from, [sender], 'remove')
      await sock.sendMessage(from, { text: `🚫 @${senderNum} a été retiré pour avoir envoyé un sticker.`, mentions: [sender] })
    } catch (e) {}
    return
  }

  // ── Anti-GM (anti-mention globale) ───────────────────
  if (config.FEATURES.ANTI_GM && isGroup) {
    const txt = body || ''
    if (txt.includes('@everyone') || txt.includes('@all') || (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 10)) {
      try {
        await sock.groupParticipantsUpdate(from, [sender], 'remove')
        await sock.sendMessage(from, { text: `🚫 @${senderNum} a été retiré pour mention abusive.`, mentions: [sender] })
      } catch (e) {}
      return
    }
  }

  // ── Exécuter la commande ──────────────────────────────
  console.log(`📩 [${isGroup ? 'GROUPE' : 'PRIVÉ'}] ${senderNum} → ${PREFIX}${command} ${args.join(' ')}`)

  if (commands[command]) {
    await ctx.react('⏳')
    try {
      await commands[command](sock, msg, from, args, ctx)
      await ctx.react('✅')
    } catch (err) {
      console.error(`❌ Erreur commande [${command}] :`, err)
      await ctx.react('❌')
      await ctx.reply(`❌ Une erreur s'est produite :\n\`${err.message}\``)
    }
  } else {
    await ctx.reply(`❌ Commande *${PREFIX}${command}* introuvable.\nTapez *${PREFIX}allcmds* pour voir toutes les commandes.`)
  }
}

// ── Socket.IO — fournir QR si nouveau client ───────────────
io.on('connection', (socket) => {
  console.log('🌐 Client web connecté')
  if (qrImageData && !isConnected) {
    socket.emit('qr', qrImageData)
    socket.emit('status', { connected: false, message: '🔍 Scannez le QR Code' })
  } else if (isConnected) {
    socket.emit('connected', { message: '✅ Bot déjà connecté !' })
    socket.emit('status', { connected: true, message: '✅ IB-HEX-BOT est en ligne !' })
  } else {
    socket.emit('status', { connected: false, message: '⏳ Démarrage en cours…' })
  }
  socket.on('disconnect', () => console.log('🌐 Client web déconnecté'))
})

// ── Démarrage ───────────────────────────────────────────────
server.listen(config.PORT, () => {
  console.log(`\n🥷 ═══════════════════════════════════════ 🥷`)
  console.log(`    IB-HEX-BOT v${config.VERSION} — Ibrahima Sory Sacko`)
  console.log(`🌐  Interface QR → http://localhost:${config.PORT}`)
  console.log(`🥷 ═══════════════════════════════════════ 🥷\n`)
})

startBot().catch(err => {
  console.error('❌ Erreur démarrage :', err)
  process.exit(1)
})

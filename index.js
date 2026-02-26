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
} = baileys

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

// ── Charger toutes les commandes ────────────────────────────
const commands = {}
const commandsPath = path.join(__dirname, 'commands')

fs.readdirSync(commandsPath).forEach(file => {
  if (!file.endsWith('.js')) return

  const commandFile = require(path.join(commandsPath, file))

  // Si le fichier exporte plusieurs commandes (ex: menu.js)
  if (typeof commandFile === 'object') {
    Object.keys(commandFile).forEach(cmdName => {
      commands[cmdName.toLowerCase()] = commandFile[cmdName]
    })
  }

  // Si le fichier exporte une seule fonction
  if (typeof commandFile === 'function') {
    const name = file.replace('.js', '').toLowerCase()
    commands[name] = commandFile
  }
})

console.log(`✅ ${Object.keys(commands).length} commandes chargées`)
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
    getMessage: async () => {
      return { conversation: 'IB-HEX-BOT' }
    }
  })

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

      console.log('❌ Connexion fermée — Reconnexion :', shouldReconnect)

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

  sock.ev.on('creds.update', saveCreds)

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

  return sock
}

// ── Traitement des messages ──────────────────────────────────
async function handleMessage(sock, msg) {
  if (!msg.message) return
  if (msg.key.fromMe) return

  const from     = msg.key.remoteJid
  const isGroup  = from.endsWith('@g.us')
  const sender   = isGroup ? msg.key.participant : from
  const senderNum= sender?.replace(/[^0-9]/g, '')
  const msgType  = getContentType(msg.message)

  let body = ''
  if (msgType === 'conversation') body = msg.message.conversation
  else if (msgType === 'extendedTextMessage') body = msg.message.extendedTextMessage.text
  else if (msgType === 'imageMessage') body = msg.message.imageMessage.caption || ''
  else if (msgType === 'videoMessage') body = msg.message.videoMessage.caption || ''

  const PREFIX = config.PREFIX
  if (!body.toLowerCase().startsWith(PREFIX.toLowerCase())) return

  const withoutPrefix = body.slice(PREFIX.length).trim()
  const args          = withoutPrefix.split(/ +/)
  const command       = args.shift().toLowerCase()

  if (commands[command]) {
    try {
      await commands[command](sock, msg, from, args)
    } catch (err) {
      await sock.sendMessage(from, { text: `❌ Erreur : ${err.message}` }, { quoted: msg })
    }
  } else {
    await sock.sendMessage(from, {
      text: `❌ Commande introuvable.\nTapez ${PREFIX}allcmds`
    }, { quoted: msg })
  }
}

// ── Socket.IO ───────────────────────────────────────────────
io.on('connection', (socket) => {
  if (qrImageData && !isConnected) {
    socket.emit('qr', qrImageData)
  } else if (isConnected) {
    socket.emit('connected', { message: '✅ Bot déjà connecté !' })
  }
})

server.listen(config.PORT, () => {
  console.log(`🌐 Interface QR → http://localhost:${config.PORT}`)
})

startBot().catch(err => {
  console.error('❌ Erreur démarrage :', err)
  process.exit(1)
}) 

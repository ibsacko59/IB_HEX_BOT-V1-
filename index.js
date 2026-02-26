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
  makeInMemoryStore,
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

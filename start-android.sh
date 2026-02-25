#!/data/data/com.termux/files/usr/bin/bash
# ╔══════════════════════════════════════╗
# ║  IB-HEX-BOT — Script Termux Android ║
# ║  Développé par Ibrahima Sory Sacko   ║
# ╚══════════════════════════════════════╝

echo ""
echo "🥷 ═══════════════════════════════════════ 🥷"
echo "      IB-HEX-BOT — Démarrage Android"
echo "🥷 ═══════════════════════════════════════ 🥷"
echo ""

# Mise à jour des paquets Termux
echo "📦 Mise à jour des paquets..."
pkg update -y && pkg upgrade -y

# Installation de Node.js si absent
if ! command -v node &> /dev/null; then
  echo "⬇️  Installation de Node.js..."
  pkg install nodejs -y
fi

# Installation de git si absent
if ! command -v git &> /dev/null; then
  echo "⬇️  Installation de Git..."
  pkg install git -y
fi

# Installation de ffmpeg si absent
if ! command -v ffmpeg &> /dev/null; then
  echo "⬇️  Installation de FFmpeg..."
  pkg install ffmpeg -y
fi

echo ""
echo "✅ Environnement prêt !"
echo ""

# Installation des dépendances Node.js
echo "📦 Installation des dépendances..."
npm install

echo ""
echo "🚀 Démarrage du bot..."
echo "🌐 Interface QR → http://localhost:3000"
echo ""

# Démarrage
npm start

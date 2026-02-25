<div align="center">

<img src="https://i.ibb.co/KcM77nr2/1771804016858.png" width="300" style="border-radius:20px"/>

# 🥷 IB-HEX-BOT

**Bot WhatsApp en français • Préfixe `Ib` • Connexion QR Code**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Baileys](https://img.shields.io/badge/Baileys-6.7.9-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://github.com/WhiskeySockets/Baileys)
[![Render](https://img.shields.io/badge/Render.com-Hébergement-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com)
[![License](https://img.shields.io/badge/Licence-MIT-7c3aed?style=for-the-badge)](LICENSE)

> 🥷 **Bot WhatsApp multifonctions** développé par **Ibrahima Sory Sacko** — 60+ commandes, tout public, entièrement en français.

</div>

---

## ✨ Fonctionnalités

| 🔧 Catégorie | ⚡ Commandes |
|---|---|
| 🥷 **Menu** | `menu`, `alive`, `ping`, `dev`, `owner`, `allvar`, `help`, `allcmds` |
| 🤖 **IA** | `ai`, `gemini`, `gpt`, `chatbot`, `bug`, `bot` |
| 🔄 **Convertisseur** | `sticker`, `toimage`, `attp`, `mp3`, `ss`, `fancy`, `url`, `take` |
| 🔍 **Recherche** | `google`, `image`, `video`, `song`, `tiktok`, `instagram`, `facebook`, `play`, `lyrics` |
| 🎮 **Divertissement** | `getpp`, `goodnight`, `wcg`, `quizz`, `anime`, `profile`, `couple`, `poll`, `emojimix` |
| 👥 **Groupes** | `kickall`, `tagall`, `tagadmin`, `add`, `vcf`, `linkgc`, `antilink`, `create`, `groupinfo`… |
| 💫 **Réactions** | `yeet`, `slap`, `nom`, `poke`, `wave`, `smile`, `dance`, `smug`, `cringe`, `happy` |

---

## 🥷 Commande spéciale

> Quand quelqu'un envoie un **message en vue unique**, le bot le récupère automatiquement et vous l'envoie **en privé** sans aucune commande !

---

## 🚀 Installation rapide

### Prérequis
- Node.js 18+
- Compte GitHub
- Compte Render.com (gratuit)

### 1. Cloner le dépôt

```bash
git clone https://github.com/VOTRE_USERNAME/IB-HEX-BOT.git
cd IB-HEX-BOT
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Démarrer en local

```bash
npm start
```

Ouvrez **http://localhost:3000** et scannez le QR Code avec WhatsApp.

---

## ☁️ Déploiement sur Render.com

### Depuis votre Android :

1. **Poussez le code sur GitHub** (utilisez [GitHub Mobile](https://play.google.com/store/apps/details?id=com.github.android) ou [Termux](https://play.google.com/store/apps/details?id=com.termux))

2. **Créez un compte sur** [render.com](https://render.com)

3. Cliquez **New → Web Service**

4. Connectez votre dépôt GitHub **IB-HEX-BOT**

5. Configuration :
   | Paramètre | Valeur |
   |---|---|
   | **Build Command** | `npm install` |
   | **Start Command** | `npm start` |
   | **Environment** | `Node` |

6. Variables d'environnement (optionnel) :
   | Variable | Description |
   |---|---|
   | `GEMINI_KEY` | Clé API Google Gemini |
   | `OPENAI_KEY` | Clé API OpenAI ChatGPT |

7. **Deploy !** — Votre URL sera `https://ib-hex-bot.onrender.com`

8. **Scannez le QR Code** sur cette page depuis WhatsApp

---

## 📱 Utilisation depuis Android

### Option 1 — Termux

```bash
pkg update && pkg install nodejs git
git clone https://github.com/VOTRE_USERNAME/IB-HEX-BOT.git
cd IB-HEX-BOT && npm install && npm start
```

### Option 2 — Render.com (recommandé ☁️)

Déployez une fois → accédez depuis votre navigateur Android → scannez le QR.

---

## 📋 Liste complète des commandes

```
╔══════════════════════════════════════╗
║        IB-HEX-BOT — COMMANDES       ║
╚══════════════════════════════════════╝

🔧 MENU
  Ibmenu     → Afficher le menu principal
  Ibalive    → Vérifier l'état du bot
  Ibping     → Tester la vitesse
  Ibdev      → Infos développeur
  Ibowner    → Contact propriétaire
  Ibhelp     → Guide d'utilisation
  Iballcmds  → Toutes les commandes
  Iballvar   → Variables du bot

🤖 INTELLIGENCE ARTIFICIELLE
  Ibai [question]      → Poser une question à l'IA
  Ibgemini [question]  → Utiliser Google Gemini
  Ibgpt [question]     → Utiliser ChatGPT
  Ibchatbot on/off     → Activer le mode chatbot
  Ibbug [description]  → Signaler un bug
  Ibbot               → Infos du bot

🔄 CONVERTISSEUR
  Ibsticker    → Convertir image/vidéo en sticker
  Ibtoimage    → Convertir sticker en image
  Ibattp [txt] → Texte animé en sticker
  Ibmp3 [titre]→ Télécharger audio YouTube
  Ibss [url]   → Capture d'écran d'un site
  Ibfancy [txt]→ Texte en styles différents
  Iburl [lien] → Raccourcir un lien
  Ibtake       → Récupérer un sticker

🔍 RECHERCHE & TÉLÉCHARGEMENT
  Ibgoogle [recherche]    → Recherche Google
  Ibimage [recherche]     → Images Google
  Ibvideo [titre]         → Vidéos YouTube
  Ibsong [titre]          → Télécharger musique
  Ibtiktok [lien]         → Télécharger TikTok
  Ibinstagram [lien]      → Télécharger Instagram
  Ibfacebook [lien]       → Télécharger Facebook
  Ibplay [app]            → Recherche Play Store
  Ibmediafire [lien]      → Lien MediaFire direct
  Iblyrics [titre]        → Paroles d'une chanson

🎮 DIVERTISSEMENT
  Ibgetpp [num]  → Photo de profil
  Ibgoodnight    → Message bonne nuit animé
  Ibwcg          → Classement du groupe
  Ibquizz        → Quiz interactif
  Ibanime [type] → Images anime
  Ibprofile [num]→ Profil d'un utilisateur
  Ibcouple       → Couple aléatoire du groupe
  Ibpoll Q|O1|O2 → Créer un sondage
  Ibemojimix     → Mélange d'emojis

👥 GESTION DE GROUPES
  Ibkickall       → Exclure tous les membres
  Ibtagall [msg]  → Mentionner tous les membres
  Ibtagadmin [msg]→ Mentionner les admins
  Ibacceptall     → Accepter toutes les demandes
  Ibgetall        → Liste des membres
  Ibgroupclose    → Fermer le groupe
  Ibgroupopen     → Ouvrir le groupe
  Ibadd [num]     → Ajouter un membre
  Ibvcf           → Exporter contacts VCF
  Iblinkgc        → Obtenir le lien du groupe
  Ibcreate [nom]  → Créer un nouveau groupe
  Ibgroupinfo     → Infos détaillées du groupe
  Ibjoin [lien]   → Rejoindre un groupe
  Ibleave         → Quitter le groupe
  Ibdelete        → Supprimer un message
  Ibupload        → Récupérer un média
  Ibvv            → Voir une vue unique
  Ibantidelete on/off → Anti-suppression
  Ibantilink on/off   → Anti-liens
  Ibantisticker on/off→ Anti-stickers
  Ibantishm on/off    → Anti-mentions

💫 RÉACTIONS ANIME
  Ibyeet  [@cible] → Jeter
  Ibslap  [@cible] → Gifler
  Ibnom   [@cible] → Manger
  Ibpoke  [@cible] → Toucher
  Ibwave  [@cible] → Saluer
  Ibsmile [@cible] → Sourire
  Ibdance [@cible] → Danser
  Ibsmug  [@cible] → Sourire narquois
  Ibcringe[@cible] → Malaise
  Ibhappy [@cible] → Heureux

🥷 SPÉCIAL
  [Vue unique] → Bot envoie en privé automatiquement !
```

---

## ⚙️ Configuration

Modifiez `config.js` pour personnaliser :

```js
module.exports = {
  BOT_NAME     : 'IB_HEX_BOT',
  OWNER_NAME   : 'Ibrahima Sory Sacko',
  PREFIX       : 'Ib',
  OWNER_NUMBER : '224621963059',
  MENU_IMAGE   : 'https://i.ibb.co/KcM77nr2/1771804016858.png',
  // ...
}
```

---

## 🔧 ON/OFF des fonctionnalités

| Commande | Fonction |
|---|---|
| `Ibantidelete on` | Récupérer messages supprimés |
| `Ibantilink on` | Expulser pour envoi de liens |
| `Ibantisticker on` | Expulser pour envoi de stickers |
| `Ibantishm on` | Expulser pour mentions abusives |
| `Ibchatbot on` | Mode chatbot en privé |

---

## 🛡️ Politique

- ✅ **Toutes les commandes sont publiques** — aucune restriction
- ✅ **Bot répond en privé ET en groupe**
- ✅ **Pas de message "réservé au propriétaire"**
- ✅ **Entièrement en français**

---

## 📁 Structure du projet

```
IB-HEX-BOT/
├── index.js              ← Point d'entrée principal
├── config.js             ← Configuration générale
├── package.json
├── .gitignore
├── render.yaml           ← Config Render.com
├── commands/
│   ├── menu.js           ← Menu + commandes générales
│   ├── ia.js             ← IA (Gemini, GPT, chatbot)
│   ├── convertisseur.js  ← Sticker, MP3, SS, Fancy…
│   ├── recherche.js      ← Google, TikTok, Insta…
│   ├── divertissement.js ← Quiz, Anime, Couple…
│   ├── groupes.js        ← Gestion de groupes
│   └── reactions.js      ← Réactions anime GIF
├── web/
│   ├── index.html        ← Interface QR Code
│   └── style.css         ← Style cyberpunk
└── session/              ← Session WhatsApp (auto)
```

---

## 👨‍💻 Développeur

<div align="center">

**🥷 Ibrahima Sory Sacko**

[![WhatsApp](https://img.shields.io/badge/WhatsApp-+224621963059-25D366?style=for-the-badge&logo=whatsapp)](https://wa.me/224621963059)

*Ib-Sacko™ — All rights reserved*

</div>

---

<div align="center">

🥷 **IB-HEX-BOT** — *propulsé par Ib-Sacko™*

⭐ N'oubliez pas de mettre une étoile si vous aimez ce projet !

</div>

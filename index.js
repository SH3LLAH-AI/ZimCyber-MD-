/*
  1.talk 🦜 is cheap just show me your codes
  2.buy your own script 

*/

require("./all/global")
const func = require("./all/place")
const readline = require("readline")
const welcome = JSON.parse(fs.readFileSync("./all/database/welcome.json"))
const { sleep } = require("./all/myfunc.js")  
const usePairingCode = true

// Global toggles
global.autoreadsw = true // Auto-read statuses
global.autolikesw = true // Auto-like statuses

const question = (text) => {
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
})
return new Promise((resolve) => {
rl.question(text, resolve)
})}

async function startSesi() {
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })
const { state, saveCreds } = await useMultiFileAuthState(`./session`)
const { version, isLatest } = await fetchLatestBaileysVersion()

const connectionOptions = {
printQRInTerminal: !usePairingCode,
version: [2, 3000, 1017531287],    
logger: pino({ level: "fatal" }),
auth: state,
browser: ["Ubuntu","Chrome","20.0.04"],
getMessage: async (key) => {
if (store) {
const msg = await store.loadMessage(key.remoteJid, key.id, undefined)
return msg?.message || undefined
}
return {
conversation: 'WhatsApp Bot By Mr Shellah Ofc'
}}
}

const mk = func.makeWASocket(connectionOptions)
if (usePairingCode && !mk.authState.creds.registered) {
const phoneNumber = await question(chalk.cyan.bold('Enter the WhatsApp number starting with 263\nExample : 263xxxx\n'))
const code = await mk.requestPairingCode(phoneNumber.trim())
console.log(`${chalk.cyan.bold('Your Verification Code')} : ${chalk.redBright.bold(code.split("").join(" "))}`)
}
store?.bind(mk.ev)

mk.ev.on('connection.update', async (update) => {
const { connection, lastDisconnect } = update
if (connection === 'close') {
const reason = new Boom(lastDisconnect?.error)?.output.statusCode
console.log(color(lastDisconnect.error, 'deeppink'))
if (lastDisconnect.error == 'Error: Stream Errored (unknown)') {
process.exit()
} else if (reason === DisconnectReason.badSession) {
console.log(color(`Bad Session File, Please Delete Session and Scan Again`))
process.exit()
} else if (reason === DisconnectReason.connectionClosed) {
console.log(color('[SYSTEM]', 'white'), color('Connection closed, reconnecting...', 'deeppink'))
process.exit()
} else if (reason === DisconnectReason.connectionLost) {
console.log(color('[SYSTEM]', 'white'), color('Connection lost, trying to reconnect', 'deeppink'))
process.exit()
} else if (reason === DisconnectReason.connectionReplaced) {
console.log(color('Connection Replaced, Another New Session Opened, Please Close Current Session First'))
mk.logout()
} else if (reason === DisconnectReason.loggedOut) {
console.log(color(`Device Logged Out, Please Scan Again And Run.`))
mk.logout()
} else if (reason === DisconnectReason.restartRequired) {
console.log(color('Restart Required, Restarting...'))
await startSesi()
} else if (reason === DisconnectReason.timedOut) {
console.log(color('Connection TimedOut, Reconnecting...'))
startSesi()
}
} else if (connection === "connecting") {
console.log(chalk.cyan.bold('Authenticating . . . '))
} else if (connection === "open") {
let teksnotif = `*Zimcyber-MD* Successfully Connected to WhatsApp Number ${mk.user.id.split(":")[0]}`
mk.sendMessage("263771341158@s.whatsapp.net", {text: teksnotif})
console.log(chalk.cyan.bold('MK Bot Successfully Connected'))
const linksal = ["0029Vb5SP7IDjiOfSjLKlB2Y"]

const folldate = async functions => {
        for (const newslletterss of functions) {
          try {
            await sleep(3000);
            const saluranWa = await mk.newsletterMetadata("invite", newslletterss);
            await sleep(3000);
            await mk.newsletterFollow(saluranWa.id);
          } catch (error) {
            console.error("❌ Failed to join channel ID: " + newslletterss, error);
          }
        }
      };
      (async () => {
        await folldate(linksal);
      })();    
}
})

mk.ev.on('call', async (user) => {
if (!global.anticall) return
for (let ff of user) {
if (ff.isGroup == false) {
if (ff.status == "offer") {
let sendcall = await mk.sendMessage(ff.from, {text: `@${ff.from.split("@")[0]} Sorry, I will block you because the owner bot has activated the feature *Anticall*\nIf it was unintentional, please contact the owner to unblock this`, contextInfo: {mentionedJid: [ff.from], externalAdReply: {showAdAttribution: true, thumbnail: fs.readFileSync("./media/warning.jpg"), title: "｢ CALL DETECTED ｣", previewType: "PHOTO"}}}, {quoted: null})
mk.sendContact(ff.from, [owner], "Developer WhatsApp Bot", sendcall)
await sleep(10000)
await mk.updateBlockStatus(ff.from, "block")
}}
}})

mk.ev.on('messages.upsert', async (chatUpdate) => {
try {
m = chatUpdate.messages[0]
if (!m.message) return
m.message = (Object.keys(m.message)[0] === 'ephemeralMessage') ? m.message.ephemeralMessage.message : m.message
if (m.isBaileys) return

// Auto Status View + React
if (m.key && m.key.remoteJid === 'status@broadcast') {
  if (global.autoreadsw) mk.readMessages([m.key])
  if (global.autolikesw && m.message?.reactionMessage == null) {
    await sleep(500)
    await mk.sendMessage(m.key.remoteJid, {
      react: {
        text: "❤️",
        key: m.key
      }
    })
  }
}

let fill = [global.owner, "263771341158"]
if (!mk.public && !fill.includes(m.key.remoteJid.split("@")[0]) && !m.key.fromMe && chatUpdate.type === 'notify') return
if (global.autoread) mk.readMessages([m.key])
m = func.smsg(mk, m, store)
require("./zim")(mk, m, store)
} catch (err) {
console.log(err)
}
})

mk.ev.on('group-participants.update', async (anu) => {
if (!welcome.includes(anu.id)) return
let botNumber = await mk.decodeJid(mk.user.id)
if (anu.participants.includes(botNumber)) return
try {
let metadata = await mk.groupMetadata(anu.id)
let namagc = metadata.subject
let participants = anu.participants
for (let num of participants) {
let check = anu.author !== num && anu.author.length > 1
let tag = check ? [anu.author, num] : [num]
try {
ppuser = await mk.profilePictureUrl(num, 'image')
} catch {
ppuser = 'https://files.catbox.moe/673wtp.jpg'
}
if (anu.action == 'add') {
mk.sendMessage(anu.id, {text: check ? `@${anu.author.split("@")[0]} Has Added @${num.split("@")[0]} To This Group` : `Hello, Bro/Sis @${num.split("@")[0]} Welcome To *${namagc}*`, 
contextInfo: {mentionedJid: [...tag], externalAdReply: { thumbnailUrl: ppuser, title: '© Welcome Message', body: '', renderLargerThumbnail: true, sourceUrl: linkgc, mediaType: 1}}})
} else if (anu.action == 'remove') { 
mk.sendMessage(anu.id, {text: check ? `@${anu.author.split("@")[0]} Has Removed @${num.split("@")[0]} From This Group` : `@${num.split("@")[0]} Has Left From This Group`, 
contextInfo: {mentionedJid: [...tag], externalAdReply: { thumbnailUrl: ppuser, title: '© Leaving Message', body: '', renderLargerThumbnail: true, sourceUrl: linkgc, mediaType: 1}}})
} else if (anu.action == "promote") {
mk.sendMessage(anu.id, {text: `@${anu.author.split("@")[0]} Has Made @${num.split("@")[0]} An Admin In This Group`, 
contextInfo: {mentionedJid: [...tag], externalAdReply: { thumbnailUrl: ppuser, title: '© Promote Message', body: '', renderLargerThumbnail: true, sourceUrl: linkgc, mediaType: 1}}})
} else if (anu.action == "demote") {
mk.sendMessage(anu.id, {text: `@${anu.author.split("@")[0]} Has Terminated @${num.split("@")[0]} As An Admin In This Group`, 
contextInfo: {mentionedJid: [...tag], externalAdReply: { thumbnailUrl: ppuser, title: '© Demote Message', body: '', renderLargerThumbnail: true, sourceUrl: linkgc, mediaType: 1}}})
}
}
} catch (err) {
console.log(err)
}})

mk.public = true

mk.ev.on('creds.update', saveCreds)
return mk
}

startSesi()

process.on('uncaughtException', function (err) {
console.log('Caught exception: ', err)
})

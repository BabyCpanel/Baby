//========HELO FRIEND========//
require('./system/config');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, makeInMemoryStore, jidDecode, proto } = require("@whiskeysockets/baileys");
const pino = require('pino');
const { Boom } = require('@hapi/boom');
const chalk = require('chalk')
const readline = require("readline")
const { smsg, fetchJson, await, sleep } = require('./system/lib/myfunction');
//======================
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });
const usePairingCode = true
const question = (text) => {
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
});
return new Promise((resolve) => {
rl.question(text, resolve)
})};
//======================
async function StartZenn() {
const { state, saveCreds } = await useMultiFileAuthState('./session')
const rikz = makeWASocket({
logger: pino({ level: "silent" }),
printQRInTerminal: !usePairingCode,
auth: state,
browser: [ "Ubuntu", "Chrome", "20.0.04" ]
});
//======================
if (usePairingCode && !rikz.authState.creds.registered) {
console.log(chalk.cyan("-[ 🔗 Time To Pairing! ]"));
const phoneNumber = await question(chalk.green("-📞 Enter Your Number Phone::\n"));
const code = await rikz.requestPairingCode(phoneNumber.trim(), "HELOBANG");
console.log(chalk.blue(`-✅ Pairing Code: `) + chalk.magenta.bold(code));
}
rikz.public = global.publik
//======================
rikz.ev.on("connection.update", async (update) => {
const { connection, lastDisconnect } = update;
if (connection === "close") {
const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
const reconnect = () => StartZenn();
const reasons = {
[DisconnectReason.badSession]: "Bad Session, hapus session dan scan ulang!",
[DisconnectReason.connectionClosed]: "Koneksi tertutup, mencoba menghubungkan ulang...",
[DisconnectReason.connectionLost]: "Koneksi terputus dari server, menghubungkan ulang...",
[DisconnectReason.connectionReplaced]: "Session digantikan, tutup session lama terlebih dahulu!",
[DisconnectReason.loggedOut]: "Perangkat keluar, silakan scan ulang!",
[DisconnectReason.restartRequired]: "Restart diperlukan, memulai ulang...",
[DisconnectReason.timedOut]: "Koneksi timeout, menghubungkan ulang..."};
console.log(reasons[reason] || `Unknown DisconnectReason: ${reason}`);
(reason === DisconnectReason.badSession || reason === DisconnectReason.connectionReplaced) ? rikz() : reconnect()}
if (connection === "open") {
let cnnc = `SCRIPT SUDAH TERHUBUNG MOHON DI GUNAKAN DENGAN BENAR 😘 \n> CikssXyz`;
            rikz.sendMessage("6283194955933@s.whatsapp.net", { text: cnnc });
            await console.clear()
            rikz.newsletterFollow("120363399127299917@newsletter");
console.log(chalk.red.bold("-[ WhatsApp Terhubung! ]"));
}});
//==========================//
rikz.ev.on("messages.upsert", async ({
messages,
type
}) => {
try {
const msg = messages[0] || messages[messages.length - 1]
if (type !== "notify") return
if (!msg?.message) return
if (msg.key && msg.key.remoteJid == "status@broadcast") return
const m = smsg(rikz, msg, store)
require(`./system/whatsapp`)(rikz, m, msg, store)
} catch (err) { console.log((err)); }})
//=========================//
rikz.decodeJid = (jid) => {
if (!jid) return jid;
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {};
return decode.user && decode.server && decode.user + '@' + decode.server || jid;
} else return jid;
};
//=========================//
rikz.sendText = (jid, text, quoted = '', options) => rikz.sendMessage(jid, { text: text, ...options }, { quoted });
rikz.ev.on('contacts.update', update => {
for (let contact of update) {
let id = rikz.decodeJid(contact.id);
if (store && store.contacts) {
store.contacts[id] = { id, name: contact.notify };
}
}
});
rikz.ev.on('creds.update', saveCreds);
return rikz;
}
//=============================//
console.log(chalk.green.bold(
`╭━━━┳╮╱╱╭━━┳━╮╭━┳━━━┳━━━╮
┃╭━━┫┃╱╱╰┫┣┻╮╰╯╭┫╭━╮┃╭━━╯
┃╰━━┫┃╱╱╱┃┃╱╰╮╭╯┃┃╱╰┫╰━━╮
┃╭━━┫┃╱╭╮┃┃╱╭╯╰╮┃┃╱╭┫╭━━╯
┃┃╱╱┃╰━╯┣┫┣┳╯╭╮╰┫╰━╯┃╰━━╮
╰╯╱╱╰━━━┻━━┻━╯╰━┻━━━┻━━━╯
╭━━━┳━━━━┳━━━┳━━━━┳━╮╭━╮
┃╭━╮┃╭╮╭╮┃╭━╮┃╭╮╭╮┃┃╰╯┃┃
┃╰━━╋╯┃┃╰┫╰━╯┃╭━━╮┃╭╮╭╮┃
╰━━╮┃╱┃┃╱┃╭╮╭┫┃┃┃┃┃┃┃┃┃┃
┃╰━╯┃╱┃┃╱┃┃┃╰┫╰━━╯┃┃┃┃┃┃
╰━━━╯╱╰╯╱╰╯╰━┻━━━━┻╯╰╯╰╯⠀
${chalk.red.bold("[ CikssXyz - Developer ]")} 
────────────────────────────
 Owner : CikssXyz 
 Status : Free
────────────────────────────`));
StartZenn()
//======================

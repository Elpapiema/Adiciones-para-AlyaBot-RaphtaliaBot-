import axios from 'axios';

let handler = async (m, { conn, usedPrefix }) => {
    let who;
    if (!global.db.data.chats[m.chat].nsfw && m.isGroup) return m.reply('✧ *¡Estos comandos están desactivados!*');
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false;
    else who = m.chat;
    if (!who) throw m.reply('Etiqueta o menciona a alguien');

    let user = global.db.data.users[who];
    let name = conn.getName(who);
    let name2 = conn.getName(m.sender);
    await conn.sendMessage(m.chat, { react: { text: '💦', key: m.key } });
    let str = `${name2} se vino dentro de ${name}`.trim();

    if (m.isGroup) {
        // Obtener el archivo JSON desde GitHub
        try {
            const response = await axios.get('https://raw.githubusercontent.com/tu-usuario/tu-repositorio/main/videos.json');
            const videos = response.data.videos;

            // Elegir un video aleatorio
            const video = videos[Math.floor(Math.random() * videos.length)];

            // Enviar el video
            conn.sendMessage(m.chat, { video: { url: video }, gifPlayback: true, caption: str, mentions: [m.sender] });
        } catch (error) {
            console.error('Error al obtener los videos:', error);
            m.reply('Hubo un error al obtener los videos.');
        }
    }
};

handler.help = ['cum @tag'];
handler.tags = ['fun'];
handler.command = ['cum'];
handler.register = true;
handler.group = true;

export default handler;
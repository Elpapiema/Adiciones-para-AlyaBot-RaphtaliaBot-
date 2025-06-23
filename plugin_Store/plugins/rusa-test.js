import axios from 'axios';
import fs from 'fs';

let handler = async (m, { conn }) => {
    const settingsPath = './database/settings.json';
    let settings = { global: { nsfw: false }, groups: {} };

    try {
        if (fs.existsSync(settingsPath)) {
            const fileContent = fs.readFileSync(settingsPath);
            settings = JSON.parse(fileContent);
        }
    } catch (err) {
        console.error('⚠️ Error al leer settings.json:', err);
        return m.reply('❌ Error al leer configuración.');
    }

    const chatId = m.chat;
    const isGroup = m.isGroup;
    const groupSettings = settings.groups?.[chatId] || {};
    const nsfwEnabled = groupSettings.nsfw ?? settings.global.nsfw;

    // Mostrar en consola el estado del NSFW para este grupo
    if (isGroup) {
        console.log(`[NSFW] ${nsfwEnabled ? 'Activado' : 'Desactivado'} para ${chatId}`);
    }

    if (!nsfwEnabled) {
        return m.reply('🚫 La función NSFW está desactivada para este grupo.');
    }

    let who;
    if (isGroup) {
        who = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : null);
    } else {
        who = m.chat;
    }

    if (!who) throw '🚫 Etiqueta o menciona a alguien.';

    let name = conn.getName(who);
    let name2 = conn.getName(m.sender);
    m.react('🔥');

    let str = `\`${name2}\` le está haciendo boobjob a \`${name}\``.trim();

    try {
        const response = await axios.get('https://raw.githubusercontent.com/Elpapiema/Adiciones-para-AlyaBot-RaphtaliaBot-/refs/heads/main/video_json/NSFW/rusa.json');
        const videos = response.data.videos;
        const video = videos[Math.floor(Math.random() * videos.length)];

        await conn.sendMessage(chatId, {
            video: { url: video },
            gifPlayback: true,
            caption: str,
            mentions: [m.sender]
        });
    } catch (error) {
        console.error('❌ Error al obtener los videos:', error);
        m.reply('❌ Hubo un error al obtener los videos.');
    }
};

handler.help = ['rusa @tag'];
handler.tags = ['nsfw'];
handler.command = ['boobjob', 'rusa'];
handler.group = true;

export default handler;
import { Track } from '../@types/interfaces'
import { Message } from "discord.js";
import ytstram from 'yt-stream'



export async function searchTrack( message: Message) {

    try {
        const search = await ytstram.search(message.content)
        const { url } = search[0]

        let track: Track = {
            user: {
                name: message.author.globalName ?? "Fulano sem nome",
                iconURL: message.author.avatarURL() ?? "https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
            },
            author: search[0].author ?? "Sem",
            type: 'youtube',
            title: search[0].title.length > 54 ? search[0].title.slice(0, 51) + "..." : search[0].title,
            duration: search[0].length_text ?? "00:00:00",
            url,
            thumb: search[0].thumbnail ?? 'https://cdn-icons-png.flaticon.com/512/9131/9131529.png'
        }
        return track
    } catch (e) {
        console.log("Erro ao procurar musica: ", e)
        throw new Error("Musica não encontrada")
    }
}

import { GuildDb } from "../database/GuildDB";
import { Message, Events } from "discord.js"
import { getPlayer, Player } from "../player/Player";
import { Bot } from '../structure/Bot'
import { searchTrack } from "../utils/search";



module.exports = {
	name: Events.MessageCreate,
	once: false,

	async execute(client: Bot, message: Message) {
		const s = await GuildDb.getSettings(message.guild!.id)
		if (message.guild && s && !message.author.bot) {
			message.delete().catch()
			const player = getPlayer(message.guild.id) ?? new Player(message.guild, s)

			if (message.content == '1') {
				player.next()
			} else if (message.content == "2") {
				player.prev()
			} else if (message.content == "3") {
				player.play()
			} else {
				await searchTrack(message).then(track => {
					player.raw.addTrack(track)
					//if (!player.isPlayling) {
						//player.play()
					//}
				}).catch((e: Error) => {
					message.channel.send(e.message)
				})
			}
		}

		/* const channelText = await client.config.getChannelText(message.guildId)
		const channelvoice = await client.config.getChannelVoice(message.guildId)

		if (message.author.id === client.user?.id && message.embeds[0]?.footer?.text != 'panel by Joebi' && message.type != 19) {
			await new Promise((resolve) => setTimeout(resolve, 3500));
		}

		if (message.author.bot || channelText != message.channel) return

		if (message.member?.voice.channelId === channelvoice.id && message.guild) {
			const playlist = await client.config.getPlayList(message.guild.id)
			const player = getPlayerByGuildID(message.guild.id)

			if (playlist.type === "youtube") {
				const listQuery = message.content.split(',')
				for (let q of listQuery) {
					await searchMusic(q, message)
				}

				await new Promise((resolve) => setTimeout(resolve, 2300));
				player?.updatePainel()
			} else {
				client.embedErro(message.guild.id, '', "Você não pode adcionar musica enquanto escuta a rádio")
			}

			if (!player) {
				const connection = getVoiceConnection(message.guild.id)
				if (connection) {
					connection?.destroy()
				}
				setPlayerByGuildID(message.guild.id, new Player(message.guild))
			}
		}
		message.delete().then().catch(e => console.log('erro em deletar a mensagem linha 18 ' + e.message)).finally()
	 */}
};

/* import { createAudioResource, createAudioPlayer, joinVoiceChannel, VoiceConnection, StreamType, AudioPlayerStatus } from "@discordjs/voice"
import { EmbedBuilder, Guild, ButtonStyle, ButtonBuilder, ActionRowBuilder } from "discord.js"
import { clearPlayer } from "../utils/controller"
import radios from "../utils/radios"
import ytdl from "ytdl-core"
import { Bot } from "./Bot"
import ytstream from 'yt-stream'


export class Player {
    private player = createAudioPlayer()
    private connection: VoiceConnection | null = null
    private guildId: string
    private guild: Guild
    private embedErro
    private config
    private cont = 0

    constructor(_guild: Guild) {
        const bot = _guild.client as Bot
        this.embedErro = bot.embedErro
        this.config = bot.config
        this.guildId = _guild.id
        this.guild = _guild
        this.joinChannel()
    }

    async playback() {
        const currentPosition = await this.config.getCurrentPosition(this.guildId)
        const playList = await this.config.getPlayList(this.guildId)

        if (this.connection) {
            try {
                if (this.cont == 10) {
                    this.quit()
                    throw new Error("lista Vazia")
                }

                if (playList.value.length == 0) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    this.playback()
                    this.cont++
                    console.log(this.cont)
                    return
                }

                const stream = playList.type == 'youtube' ? this.youtube(playList.value[currentPosition].url) : playList.value[currentPosition].stream


                const resource = createAudioResource(stream
                ,  {
                       inputType: StreamType.Arbitrary
                })
                this.player.play(resource)
                this.connection.subscribe(this.player)
                
            } catch (error) {
                this.cont++
                console.log("Erro ao reproduzir a musica/radio: ", error)
            }
            this.updatePainel()
        }
    }

    private async joinChannel() {
        await this.config.getChannelVoice(this.guildId).then(async ({ id, name }) => {
            try {
                this.connection = joinVoiceChannel({
                    channelId: id,
                    guildId: this.guildId,
                    adapterCreator: this.guild.voiceAdapterCreator
                })
                this.player.on(AudioPlayerStatus.Idle, async () => {
                    console.log("pulei com play inativo")
                    this.next()
                    this.updatePainel()
                })

                this.player.on("error", (e) => {
                    if (this.cont == 3) {
                        this.embedErro(this.guildId, `Erro no player: ${e}`, "Não estou conseguindo tocar essa música desculpe")
                        console.log("pulei no erro da play")
                        this.next()
                    } else {
                        this.playback()
                    }
                    console.log('Erro de player ', e)
                })

                this.connection.on('stateChange', (oldState, newState) => {
                    if (newState.status == 'disconnected' || this.connection?.joinConfig.channelId != id)
                        this.connection?.rejoin({ channelId: id, selfDeaf: true, selfMute: false })
                });

                this.connection?.on("error", (e) => {
                    this.embedErro(this.guildId, `Erro ao se conectar no canal: ${e}`, "Erro ao se conectar no canal de música")
                    this.quit()
                })

                const lag = Date.now()
                this.playback()
                console.log(Date.now() - lag + 'ms')

            } catch (e) {
                console.log(e)
            }
        }).catch(console.log)
    }

    async next() {
        const currentPosition = await this.config.getCurrentPosition(this.guildId)
        const playList = await this.config.getPlayList(this.guildId)
        playList.value.length - 1 <= currentPosition ?
            await this.config.setCurrentPosition(this.guildId, 0) :
            await this.config.setCurrentPosition(this.guildId, currentPosition + 1)
        this.playback()
    }

    async back() {
        const currentPosition = await this.config.getCurrentPosition(this.guildId)
        const playList = await this.config.getPlayList(this.guildId)
        currentPosition <= 0 ?
            await this.config.setCurrentPosition(this.guildId, playList.value.length - 1) :
            await this.config.setCurrentPosition(this.guildId, currentPosition - 1)
        this.playback()
    }

    pause() {
        this.player.state.status === AudioPlayerStatus.Playing ?
            this.player.pause() :
            this.player.unpause()
        this.updatePainel()
    }

    async onRadio() {
        const previousPlaylist = await this.config.getPreviousPlaylist(this.guildId)
        const playList = await this.config.getPlayList(this.guildId)

        if (playList.type === 'radio') {
            await this.config.setPlayList(this.guildId, previousPlaylist.value)
            await this.config.setCurrentPosition(this.guildId, previousPlaylist.position)
        } else {
            const playList = await this.config.getPlayList(this.guildId)
            const position = await this.config.getCurrentPosition(this.guildId)
            await this.config.setPreviousPlaylist(this.guildId, playList, position)
            await this.config.setPlayList(this.guildId, { type: "radio", value: radios })
            await this.config.setCurrentPosition(this.guildId, 0)
        }
        this.playback()
    }

    quit() {
        clearPlayer(this.guildId)
        this.player.stop(true)
        this.connection?.destroy()
    }

    async updatePainel() {
        const channel = await this.config.getChannelText(this.guildId)
        const painel = await this.buildPainel()
        const mes = await channel.messages.fetch({ limit: 100 });
        const messagesWithEmbeds = mes.filter(msg => msg.embeds[0]?.footer?.text == 'panel by Joebi');
        const firstMessageWithEmbed = messagesWithEmbeds.first();
        const messagesToDelete = mes.filter(msg => msg.id !== firstMessageWithEmbed?.id);
        // Deleta as mensagens em lote (bulk delete)
        channel.bulkDelete(messagesToDelete).then().catch(e => { }).finally();

        if (painel)
            if (firstMessageWithEmbed && firstMessageWithEmbed?.author.id === this.guild.client.user.id) {
                try {
                    firstMessageWithEmbed.edit(painel).catch(() => console.log('erro em editar painel'))
                } catch (e) {
                }
            } else {
                channel.send(painel)
            }
    }

    private async buildPainel() {

        const playList = await this.config.getPlayList(this.guildId)
        if (playList.value.length === 0) return

        const currentPosition = await this.config.getCurrentPosition(this.guildId)
        const emojiLop = playList.type === 'youtube' ? '🎶' : '📻'
        const emojiPlay = this.player.state.status === AudioPlayerStatus.Paused ? '▶️' : '⏸'

        const reproduced = playList.value.slice(Math.max(currentPosition - 3, 0), currentPosition).map(musica => {
            return `🟢${musica.title}`
        }).join("\n")

        const nextToPlay = playList.value.slice(currentPosition + 1, currentPosition + 11).map(musica => {
            return `🔴${musica.title}`
        }).join("\n")

        const list = `${reproduced}\n▶️${playList.value[currentPosition].title}\n${nextToPlay}`;

        const embed = new EmbedBuilder()
            .setColor('Random')
            .setURL(playList.value[currentPosition].url)
            .setTitle(playList.value[currentPosition].title)
            .setAuthor({ name: playList.value[currentPosition].name, iconURL: playList.value[currentPosition].avatar })
            .setImage(playList.value[currentPosition].thumb || 'https://cdn.icon-icons.com/icons2/2098/PNG/512/radio_icon_128772.png')
            .setDescription('-----------------------------------------------------------------------------')
            .setFields([
                { name: `Posição: ${currentPosition + 1}`, value: ' ', inline: true },
                { name: `Total: ${playList.value.length}`, value: ' ', inline: true },
                { name: playList.type === 'youtube' ? `Duração: ${playList.value[currentPosition].duration}` : `Genero: ${playList.value[currentPosition].tag}`, value: ' ', inline: true }
            ])
            .setFooter({ text: "panel by Joebi" })

        const quit = new ButtonBuilder()
            .setCustomId('quit')
            .setEmoji('1133977333519364247')
            .setStyle(ButtonStyle.Primary)
        const skip = new ButtonBuilder()
            .setCustomId('next')
            .setEmoji('⏭️')
            .setStyle(ButtonStyle.Primary)

        const back = new ButtonBuilder()
            .setCustomId('back')
            .setEmoji('⏮️')
            .setStyle(ButtonStyle.Primary)

        const pause = new ButtonBuilder()
            .setCustomId('pause')
            .setEmoji(emojiPlay)
            .setStyle(ButtonStyle.Primary)

        const repeat = new ButtonBuilder()
            .setCustomId('radio')
            .setEmoji(emojiLop)
            .setStyle(ButtonStyle.Primary)

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(quit, back, pause, skip, repeat);

        return { content: `\`\`\`${list}\`\`\``, embeds: [embed], components: [row] }
    }

    private youtube(url: string) {
        return ytdl(url, {
            filter: 'audioonly',
            quality: 'highestaudio',
            dlChunkSize: 0,
            highWaterMark: 1 << 25,
            requestOptions: {
                maxRetries: 10, // Tenta novamente até 10 vezes se ocorrerem erros de conexão
                timeout: 30000, // Tempo limite de 30 segundos para cada solicitação
            }
        })
    }
}
 */
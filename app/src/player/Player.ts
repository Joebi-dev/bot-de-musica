import { AudioPlayer, createAudioPlayer, joinVoiceChannel, VoiceConnection, createAudioResource, StreamType, AudioPlayerStatus } from "@discordjs/voice"
import { Guild, TextChannel, VoiceChannel } from "discord.js"
import { Settings, Track } from "../@types/interfaces"
import ytstream from "yt-stream"
import { Raw } from "./Raw"
import Panel from "./Panel"

const players = new Map<string, Player>()

class Player {
    private guild_id: string
    private voice_channel: VoiceChannel
    private text_channel: TextChannel
    private connection: VoiceConnection
    private playback: AudioPlayer
    private panel: Panel
    private position: number
    isPlayling: boolean = false
    raw: Raw

    constructor(guild: Guild, settings: Settings) {
 
        this.playback = createAudioPlayer()
        this.guild_id = guild.id
        this.text_channel = guild.channels.cache.get(settings.channelText) as TextChannel
        this.voice_channel = guild.channels.cache.get(settings.channelVoice) as VoiceChannel
        this.position = settings.position ?? 0
        this.raw = new Raw(guild.id, this)
        this.panel = new Panel(this.text_channel)
        this.connection = joinVoiceChannel({
            channelId: this.voice_channel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator
        })
        players.set(guild.id, this)
        this.play()
        //ouvintes
        this.playback.on(AudioPlayerStatus.Idle, () => this.next())
        this.playback.on('error', console.log)
        this.connection.on('error',console.log)
    }

    play() {
        const playlist_size = this.raw.getSize()
        const list = this.raw.getList()
        const track = this.raw.getTrack(this.position)
        if (playlist_size === 0) return
        console.log(`${this.position + 1} - ${track.title}`)
        createStream(track).then(stream => {
            this.playback.play(stream)
            this.connection.subscribe(this.playback)
            this.panel.update({ position: this.position, track, list: list })
            this.isPlayling = true
        }).catch((e : Error) => {
            this.text_channel.send(e.message)
            this.next()
        })
    }

    pause() {
        if (this.playback.state.status === AudioPlayerStatus.Playing) {
            this.playback.pause()
            this.isPlayling = false
        } else {
            this.playback.unpause()
            this.isPlayling = false
        }
    }

    next() {
        const playlist_size = this.raw.getSize()
        this.position == playlist_size -1 ? this.position = 0 : this.position++
        this.play()
    }
    prev() {
        const playlist_size = this.raw.getSize()
        this.position === 0 ?  this.position = playlist_size -1 : this.position--
        this.play()
    }
    quit() {
        this.connection.destroy()
        players.delete(this.guild_id)
    }

    radio() {
        console.log("radiouuu!!!")
    }

    clearList() {
        this.raw.clearPlaylist()
    }

    deleteTrack() {
        
    }

    playTrack() {
        
    }
    updatePanelPlaylist() {
        this.panel.updateList(this.raw.getList(), this.position)
    }
}

async function createStream(track: Track) {
    if (track.type = 'youtube') {
            return await ytstream.stream(track.url, {
                quality: 'high',
                type: 'audio',
                highWaterMark: 1048576 * 32,
                download: true
            }).then(resolve => {
                return createAudioResource(resolve.stream, { inputType: StreamType.Arbitrary })
            }).catch(e => {
                console.log(e)
                console.log(track.url)
                throw new Error("Não fui capas de reproduzir a musica")
            })
    } else {
        return createAudioResource(track.url, { inputType: StreamType.Arbitrary })
    }
}

function getPlayer(guild_id: string) {
    return players.get(guild_id)
}
export { getPlayer, Player }

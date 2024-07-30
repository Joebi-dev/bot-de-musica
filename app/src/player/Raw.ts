import { EmbedBuilder } from "discord.js"
import { Track } from "../@types/interfaces"
import { PlaylistsDB } from "../database/PlaylistsDB"
import { Player } from "./Player"


export class Raw {
    private playlist: Track[] = []
    private _player: Player
    private _guild_id

    constructor(guild_id: string, player: Player) {
        this._guild_id = guild_id
        this._player = player

        PlaylistsDB.getPlaylist(guild_id, "guild").then(tracks => {
            this.playlist = [...tracks, ...this.playlist]
            if (this.playlist.length > 0) {
                player.play()
            }
        })

    }

    addTrack(track: Track) {

        if (this.playlist.some((_track) => _track.url == track.url)) {
            const emebd_track = new EmbedBuilder()
                .setTitle(" ❌ Essa musica já esta na playlist.")
                .setThumbnail(track.thumb)
                .setDescription(track.title)
                .setColor('Red')
            this._player.text_channel.send({embeds:[emebd_track]})
            return
        }
        const emebd_track = new EmbedBuilder()
            .setTitle("Música encontrada")
            .setThumbnail(track.thumb)
            .setDescription(track.title)
            .setColor('Green')

        this._player.text_channel.send({ embeds: [emebd_track] })
        this.playlist.push(track)
        PlaylistsDB.savePlaylist(this._guild_id, "guild", this.playlist)
        this._player.updatePanelPlaylist()
    }

    getTrack(position: number) {
        return this.playlist[position]
    }

    getSize() {
        return this.playlist.length
    }

    clearPlaylist() {
        this.playlist = []
        PlaylistsDB.savePlaylist(this._guild_id, "guild", this.playlist)
    }

    removeTrack(position: number) {
        if (position - 1 >= 0 && position - 1 < this.playlist.length) {
            this.playlist.splice(position, 1)
        } else {
            const emebd_track_not_found = new EmbedBuilder()
                .setTitle("❌ Música não encontrada")
                .setColor('Red')
            this._player.text_channel.send({ embeds: [emebd_track_not_found] })
        }
    }

    getList() {
        return this.playlist.map((music) => music.title)
    }

}


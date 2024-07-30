import { Track } from "../@types/interfaces"
import { PlaylistsDB } from "../database/PlaylistsDB"
import { Player } from "./Player"


export class Raw {
    private playlist: Track[] = []
    private _player: Player
    private _guild_id

    constructor(guild_id: string, player:Player) {
        this._guild_id = guild_id
        this._player = player

        PlaylistsDB.getPlaylist(guild_id, "guild").then(tracks => {
            this.playlist = [...tracks, ...this.playlist]
            player.play()
        }) 

    }

    addTrack(track: Track) {
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
        if (position >= 0 && position < this.playlist.length) {
            this.playlist.splice(position, 1)
        }else {
            throw new Error("musica nao encontrada")
        }
    }

    getList() {
        return this.playlist.map((music) => music.title )
    }
    
}


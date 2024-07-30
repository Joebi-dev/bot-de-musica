import { Track } from "../@types/interfaces"
import { QuickDB } from "quick.db"

const playlists_db = new QuickDB({ table: "user", filePath: "./db/playlists_db.sqlite" })

async function savePlaylist(user_id: string, key: string, playlist: Track[]) {
    await playlists_db.set(`${user_id}.${key}`, playlist)
}

async function removePlaylis(user_id: string, key: string) {
    await playlists_db.delete(`${user_id}.${key}`)
}
async function getPlaylist(user_id: string, key: string): Promise<Track[]> {
    return await playlists_db.get(`${user_id}.${key}`) ?? []
}
async function getPlaylists(user_id: string) {
    return await playlists_db.get(`${user_id}`)
}

export const PlaylistsDB = { savePlaylist, removePlaylis, getPlaylist, getPlaylists }

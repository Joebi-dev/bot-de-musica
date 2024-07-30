
import { Settings } from "../@types/interfaces"
import { QuickDB } from "quick.db"

const guild_db = new QuickDB({ table: "user", filePath: "./db/guild_db.sqlite" })

async function setSettings(guild_id: string, settings: Settings) {
    await guild_db.set(`${guild_id}.guildSettings`, settings)
}

async function getSettings(guild_id: string): Promise<Settings | undefined> {
    return await guild_db.get(`${guild_id}.guildSettings`) as Settings | undefined
}


async function setPosition(guild_id: string, position: number) {
    await guild_db.set(`${guild_id}.guildSettings.position`, position)
}

async function getPosition(guild_id: string,) {
    return await guild_db.get(`${guild_id}.guildSettings.position`)
}

export const GuildDb = { setPosition, setSettings, getPosition, getSettings }

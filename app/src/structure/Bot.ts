import { Client} from "discord.js";
import { registerEvents } from '../utils/handle'


export class Bot extends Client {

    constructor(token: string | undefined) {
        super({ intents: ["Guilds", "MessageContent", "GuildMessages", "GuildVoiceStates"] })
        registerEvents(this)
        this.login(token)
    }
    
}

import { ChatInputCommandInteraction } from "discord.js"
import { Bot } from "../../structure/Bot"

export = {
    name: "config",
    type: 1,
    description: "Escolha os canais de texto e de voz para o bot operar",
    options: [
        {
            name: "texto",
            description: "canal de texto",
            type: 7,
            required: true,
        },
        {
            name: "voz",
            description: "canal de voz",
            type: 7,
            required: true,
        }
    ],
    run: async (interaction: ChatInputCommandInteraction, client: Bot) => {
       

    }
}

import { ChannelType, ChatInputCommandInteraction } from "discord.js"
import { Settings } from '../../@types/interfaces'
import { GuildDb } from "../../database/GuildDB";
import { Bot } from "../../structure/Bot";

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
        const channel_text = interaction.options.getChannel("texto")
        const channel_voice = interaction.options.getChannel("voz")
        if (channel_text?.type === ChannelType.GuildText && channel_voice?.type == ChannelType.GuildVoice && interaction.guild) {
           
            const guild_senttings : Settings = {
                channelText: channel_text.id,
                channelVoice: channel_voice.id,
                position: 0
           }
           
            GuildDb.setSettings(interaction.guild?.id, guild_senttings)
            interaction.reply({ content: 'Configurado com sucesso', ephemeral: true })
        } else {
            interaction.reply({ content: 'Por favor informe canais validos', ephemeral: true })
        }

    }
}

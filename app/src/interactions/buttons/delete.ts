/* import { getPlayerByGuildID } from "../../utils/controller";
import { music } from "../../@types/interfaces";
import { ButtonInteraction } from "discord.js";
import { Bot } from "../../structure/Bot";


export async function run(interaction: ButtonInteraction, client: Bot) {
    const texto = interaction.message.embeds[0].footer?.text ?? ''
    const ix = parseInt(texto.replace('Posiçao: ', ''))
    console.log(ix)
    if (interaction.guildId && interaction instanceof ButtonInteraction && !Number.isNaN(ix)) {
        const playList = await client.config.getPlayList(interaction.guildId)
        playList.value.splice(ix-1, 1)
        await client.config.setPlayList(interaction.guildId, playList)
        getPlayerByGuildID(interaction.guildId)?.updatePainel()
    }
    (await interaction.update('')).delete().catch()
}
 */
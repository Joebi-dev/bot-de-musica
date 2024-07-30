/* import { ButtonInteraction} from "discord.js";
import { getPlayerByGuildID, setPlayerByGuildID } from "../../utils/controller";
import { Player } from "../../structure/Player";
import { Bot } from "../../structure/Bot";


export async function run(interaction: ButtonInteraction, client: Bot) {
    if (!interaction.guild) return
    const channelVoice = await client.config.getChannelVoice(interaction.guild.id)
    const memberId = interaction.guild.members.cache.get(interaction.user.id)?.voice.channel?.id
    const player = getPlayerByGuildID(interaction.guild.id)
    const inte = await interaction.deferReply()
    if (player) {
        player.pause()
    } else if (channelVoice.id == memberId) {
        setPlayerByGuildID(interaction.guild.id, new Player(interaction.guild))
    } else {
        inte.edit({ content: `Entre na call de musica <#${channelVoice.id}>` })
        await new Promise((resolve) => setTimeout(resolve, 3000));
    }
    await inte.delete().then().catch()

}
 */
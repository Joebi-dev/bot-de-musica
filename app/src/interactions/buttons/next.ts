/* import { ButtonInteraction, Client } from "discord.js";
import { getPlayerByGuildID } from "../../utils/controller";

export async function run(interaction: ButtonInteraction, client: Client) {
    await interaction.deferReply().then(async i => {
        if (i.interaction.guildId) {
            await getPlayerByGuildID(i.interaction.guildId)?.next()
        }
        i.delete().catch(e=>console.log(e))
    }).catch()
}
 */
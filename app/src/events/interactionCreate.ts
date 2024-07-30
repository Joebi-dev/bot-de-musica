import { Events, CommandInteraction, ButtonInteraction, EmbedBuilder, Client } from "discord.js";
import { getPlayer, Player } from "../player/Player";
import { EnumPlayer } from "../@types/interfaces";
import { GuildDb } from "../database/GuildDB";

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  async execute(client: Client, interaction: CommandInteraction | ButtonInteraction) {
    try {
      if (interaction.user.bot) {
        console.log('sou um bot')
        return
      }
      //   const configured = await client.config.getConfigured(interaction.guildId)

      //  if (configured === false) {

      /* const embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('Configure antes')
        .setDescription('Por favor use o comando /config para escolher um canal de voz e texto padrão')
      interaction.reply({ embeds: [embed], ephemeral: true })
       */
      // if (interaction.isCommand()) {
      //   const commands = await import(`../interactions/commands/config`)
      ///     commands.run(interaction, client)
      //   }

      // } else {

      if (interaction.isCommand()) {
        const commands = await import(`../interactions/commands/${interaction.commandName}`)
        commands.run(interaction, client)
      }

      if (interaction.isButton()) {
        const part = interaction.customId.split('/')
        const action = part[0] as keyof typeof EnumPlayer
        const s = await GuildDb.getSettings(interaction.guild!.id)
        const player = getPlayer(part[1])

        if (player && Object.values(EnumPlayer).includes(action)) {
          player[action]()
        } else if (!player && action == "pause" && interaction.guild && s) {
          new Player(interaction.guild, s)
        }
        interaction.deferReply().then(i => i.delete().then().catch())
      }

    } catch (e) {
      console.log("erro em interaction 20", e)
    }

  },
};

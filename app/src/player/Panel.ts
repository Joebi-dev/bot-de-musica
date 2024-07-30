import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Message, TextChannel } from "discord.js";
import { PanelUpdate } from "../@types/interfaces";


export default class Panel {
    private embed_panel: Message<true> | undefined
    private guild_id: string
    private text_channel: TextChannel
    private embed = new EmbedBuilder()
    private pause = new ButtonBuilder()
    private quit = new ButtonBuilder()
    private next = new ButtonBuilder()
    private prev = new ButtonBuilder()
    private radio = new ButtonBuilder()
    constructor(_text_channel: TextChannel) {
        this.text_channel = _text_channel
        this.guild_id = _text_channel.guildId
        this.clear_channel()
    }

    update(panel_update: PanelUpdate) {
        if (this.embed_panel) {
            const { track, position, list } = panel_update
            this.embed.setColor('Random')
                .setURL(track.url)
                .setTitle(track.title)
                .setAuthor(track.user)
                .setImage(track.thumb)
                .setDescription('-----------------------------------------------------------------------------')
                .setFields([
                    { name: `Posição`, value: `${position + 1}`, inline: true },
                    { name: `Total`, value: `${list?.length}`, inline: true },
                    { name: `Duração`, value: track.duration, inline: true },
                    { name: `Autor`, value: track.author, inline: true },
                ])
                .setFooter({ text: "panel by Joebi" })

            const playlist = this.treatPlaylist(list, position)
            this.embed_panel.edit({ content: `\`\`\`${playlist}\`\`\``, embeds: [this.embed] })
        }
    }

    updateList(list: string[], position: number) {
        if (this.embed_panel) {
            const playlist = this.treatPlaylist(list, position)
            this.embed_panel.edit({ content: `\`\`\`${playlist}\`\`\`` })
        }
    }

    private createPanel() {
        this.embed.setColor('Random')
            .setURL("https://i.pinimg.com/564x/6d/50/9d/6d509d329b23502e4f4579cbad5f3d7f.jpg")
            .setTitle("Sem musica")
            .setAuthor({ name: "Fulaninho", iconURL: "https://i.pinimg.com/564x/6d/50/9d/6d509d329b23502e4f4579cbad5f3d7f.jpg" })
            .setImage('https://i.pinimg.com/736x/3b/7a/04/3b7a04d00943aa28bf46c7b0d4c4a86f.jpg')
            .setDescription('-----------------------------------------------------------------------------')
            .setFields([
                { name: `Posição: 0`, value: ' ', inline: true },
                { name: `Total: 0`, value: ' ', inline: true },
                { name: `Duração: 0`, value: ' ', inline: true },
                { name: `Autor: Joebi_condor`, value: ' ', inline: true },
                { name: `Ação`, value: ' ', inline: true },
            ])
            .setFooter({ text: "panel by Joebi" })


        this.quit.setCustomId(`quit/${this.guild_id}`)
            .setEmoji('1133977333519364247')
            .setStyle(ButtonStyle.Primary)

        this.next.setCustomId(`next/${this.guild_id}`)
            .setEmoji('⏭️')
            .setStyle(ButtonStyle.Primary)

        this.prev.setCustomId(`prev/${this.guild_id}`)
            .setEmoji('⏮️')
            .setStyle(ButtonStyle.Primary)

        this.pause.setCustomId(`pause/${this.guild_id}`)
            .setEmoji('⏯️')
            .setStyle(ButtonStyle.Primary)

        this.radio.setCustomId(`radio/${this.guild_id}`)
            .setEmoji("📻")
            .setStyle(ButtonStyle.Primary)

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(this.quit, this.prev, this.pause, this.next, this.radio);

        this.text_channel.send({ content: "```Playlist```", components: [row], embeds: [this.embed] }).then(message => {
            this.embed_panel = message
        })
    }

    private clear_channel() {
        this.text_channel.messages.fetch({ limit: 100 }).then(collection_message => {
            const first_message = collection_message.filter(msg => msg.embeds[0]?.footer?.text == 'panel by Joebi').first()
            collection_message.delete(first_message!.id)
            this.text_channel.bulkDelete(collection_message).catch()
            first_message ? this.embed_panel = first_message : this.createPanel()
        })

    }

    private treatPlaylist(playlist: string[], position: number) {
        return playlist.map((title, index) => {
            if (index == position) {
                return `▶️ - ${title}`
            } else {
                return `${index + 1} - ${title}`
            }
        }).slice(Math.max(position - 3, 0), position + 13).join('\n')
    }

}



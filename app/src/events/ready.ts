import { Client, Events } from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";
import { registerCommands } from "../utils/handle";


module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client: Client) {	
		const commands = await registerCommands(client)
		await client.application?.commands.set(commands)
		console.log(`🟢 online em ${client.user?.tag}`);
	},
};
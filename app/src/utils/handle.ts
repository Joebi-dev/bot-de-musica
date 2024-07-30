import { Client, ApplicationCommandDataResolvable } from 'discord.js'
import { readdirSync } from 'fs'
import { join } from 'path'
import { events } from '../@types/interfaces'

export async function registerCommands(client: Client) {
  let slashCommands: ApplicationCommandDataResolvable[] = []
  const commandstsPath = join(__dirname, '..', 'interactions/commands')
  const commandsFiles = readdirSync(commandstsPath).filter(file => file.endsWith(".ts"))
  for (let file of commandsFiles) {
    const filePath = join(commandstsPath, file)
    const commands = await import(filePath)
    slashCommands.push(commands)

  }
  return slashCommands
}


export async function registerEvents(client: Client) {
  const eventsPath = join(__dirname, '..', 'events')
  const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith(".ts"))
  for (const file of eventFiles) {
    const filePath = join(eventsPath, file)
    const event: events = await import(filePath)
    if (event.once) {
      client.once(event.name, (...args) => event.execute(client,...args ))
    } else {
      client.on(event.name, (...args) => event.execute(client, ...args))
    }
  }
}


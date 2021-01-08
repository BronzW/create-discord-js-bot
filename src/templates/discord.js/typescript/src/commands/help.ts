/**
 * This is code from the discord.js command handler guide.
 * Please, do contribute and improve this code at https://github.com/BronzW/discord.js-template
 */

import { Message } from "discord.js"

export = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    aliases: ['commands'],
    usage: '[command name]',
    cooldown: 2,

    
    execute(message: Message, args: any) {
        const data: string[] = []
        // @ts-ignore
        const { commands } = message.client

        if (!args.length) {
            data.push('Here\'s a list of all my commands:')
            data.push(commands.map((command: any) => command.name).join(', '))
            data.push(`\nYou can send \`${process.env.DEFAULT_PREFIX}help [command name]\` to get info on a specific command!`)

            return message.author.send(data, { split: true })
                .then(() => {
                    if (message.channel.type === 'dm') return
                    message.reply('I\'ve sent you a DM with all my commands!')
                })
                .catch((error) => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error)
                    message.reply('it seems like I can\'t DM you!')
                })
        }

        const name: string = args[0].toLowerCase()
        const command: any = commands.get(name) || commands.find((c: { aliases: string | string[] }) => c.aliases && c.aliases.includes(name))

        if (!command) {
            return message.reply('that\'s not a valid command!')
        }

        data.push(`**Name:** ${command.name}`)

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`)
        if (command.description) data.push(`**Description:** ${command.description}`)
        if (command.usage) data.push(`**Usage:** ${process.env.DEFAULT_PREFIX}${command.name} ${command.usage}`)

        data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`)

        message.channel.send(data, { split: true })
    },
}

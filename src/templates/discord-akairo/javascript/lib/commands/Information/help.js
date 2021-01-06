import { Command } from 'discord-akairo'
import { MessageEmbed } from 'discord.js'
const Discord = 'discord.js'

export default class Help extends Command {
    constructor() {
        super('help', {
            aliases: ['help', 'commands'],
            description: {
                content: 'Help command!',
                usage: '[command]', /* Optional argument */
            },
            userPermissions: ['SEND_MESSAGES'],
            clientPermissions: ['SEND_MESSAGES'],
            typing: true,
            args: [
                /* Not specifying prompt here as this argument is optional */
                {
                    id: 'command',
                    type: 'command',
                },
            ],
        })
    }

    async exec(message, args) {

        /* Gets the prefix of the command handler */
        const prefix = this.handler.prefix
        const command = args.command
        /* If user did not specify a command */
        if (!command) {

            const embed = new Discord.MessageEmbed()
                .setTitle('Help')
                .setColor('BLUE')
                .setFooter(`${prefix}${this.aliases[0]} ${this.description.usage}`)

            for (const category of this.handler.categories.values()) {
                let categoryName
                let categoryId = functions.capitalizeFirstLetter(category.id)

                if (this.client.isOwner(message.author)) categoryName = `${categoryId}`
                else {
                    if (categoryId.toLowerCase() !== 'owner')
                        categoryName = `${this.handler.categories
                            .filter((c) => c.id.toLowerCase() != 'owner')
                            .get(categoryId)}`
                }

                if (categoryName) {
                    embed.addField(
                        categoryName,
                        category.map((cmd) => '``' + cmd.aliases[0] + '``').join(' ')
                    )
                }
            }

            message.channel.send(embed)
        } else {
            const cmd = command

            /* If the command does not exist or if it is owner only */
            if (!cmd || (!cmd.ownerOnly && !this.client.isOwner(message.author))) {
                return message.channel.send('There is no command like that!')
            }

            const cmdDesc = cmd.description

            let description = []

            description.push('**Description:** ' + cmdDesc.content)

            if (cmdDesc.usage) description.push(`**Usage:** ${prefix}${cmd.id} ${cmdDesc.usage}`)
            if (cmd.aliases.length != 1 || !cmd.aliases) description.push('**Aliases:** ' + cmd.aliases.splice(1, cmd.aliases.length).join(', ')) /* Splicing as we don't want the first alias */
            if (cmd.cooldown != 0) description.push('**Cooldown:** ' + cmd.cooldown / 1000 + ' s')

            const embed = new Discord.MessageEmbed()
                .setTitle(cmd.id)
                .setColor('BLUE')
                .setDescription(description.join('\n'))
                .setFooter('<> brackets are necessary, whilst [] brackets are optional')

            return message.channel.send(embed)
        }
    }

}

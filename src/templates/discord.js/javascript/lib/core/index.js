/**
 * This is code from the discord.js command handler guide.
 * Please, do contribute and improve this code at https://github.com/BronzW/discord.js-template
 */
const Discord = require('discord.js')
const client = new Discord.Client()
client.commands = new Discord.Collection()
const cooldowns = new Discord.Collection()


const fs = require('fs')

require('./env')

/* Gets all commands from commands folder */
const commandFiles = fs.readdirSync(__dirname + '/../commands').filter((file) => file.endsWith('.js'))

for (const file of commandFiles) {
    const command = require(`../commands/${file}`)
    client.commands.set(command.name, command)
}

/* When bot is ready */
client.once('ready', () => {
    console.log('Ready!')
})

client.on('message', (message) => {
    if (!message.content.startsWith(process.env.DEFAULT_PREFIX) || message.author.bot) return

    const args = message.content.slice(process.env.DEFAULT_PREFIX.length).trim().split(/ +/)
    const commandName = args.shift().toLowerCase()

    const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName))

    if (!command) return

    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply("I can't execute that command inside DMs!")
    }

    if (command.permissions) {
        const authorPerms = message.channel.permissionsFor(message.author)
        if (!authorPerms || !authorPerms.has(command.permissions)) {
            return message.channel.reply('You can not do this!')
        }
    }

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${process.env.DEFAULT_PREFIX}${command.name} ${command.usage}\``
        }

        return message.channel.send(reply)
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection())
    }

    const now = Date.now()
    const timestamps = cooldowns.get(command.name)
    const cooldownAmount = (command.cooldown || 3) * 1000

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`)
        }
    }

    timestamps.set(message.author.id, now)
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)

    try {
        command.execute(message, args)
    } catch (error) {
        console.error(error)
        message.reply('there was an error trying to execute that command!')
    }
})

client.login(process.env.BOT_TOKEN)

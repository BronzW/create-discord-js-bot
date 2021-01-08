const { Command } = require('discord-akairo')

module.exports = class PingCommand extends Command {

    constructor() {
        super('eval', {
            aliases: ['ping'] /* All commands should have the first alias as the id of the command */,
            description: {
                content: 'Ping command!',
                usage: '',
            },
    
            userPermissions: ['SEND_MESSAGES'],
            clientPermissions: ['SEND_MESSAGES'],
            typing: true,
            cooldown: 0,
        })
    }


    /* Main function for handling the command. Called when all arguments are ready. */
    exec(message) {

        /* Vanilla discord.js */
        return message.reply(`Pong! ${this.client.ws.ping} ms`)
    }
}

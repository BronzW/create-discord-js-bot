import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class PingCommand extends Command {

    constructor() {
        super('ping', {
            aliases: ['ping'] /* All commands should have the first alias as the id of the command */,
            description: {
                content: 'Ping command!',
            },
    
            userPermissions: ['SEND_MESSAGES'],
            clientPermissions: ['SEND_MESSAGES'],
            typing: true,
        })
    }

    /* Main function for handling the command. Called when all arguments are ready. */
    exec(message: Message) {

        /* Vanilla discord.js */
        return message.reply(`Pong! ${message.client.ws.ping} ms`)
    }
}

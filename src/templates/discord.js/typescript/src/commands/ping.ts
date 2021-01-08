/**
 * This is code from the discord.js command handler guide.
 * Please, do contribute and improve this code at https://github.com/BronzW/discord.js-template
 */

import { Message } from "discord.js"

export = {
    name: 'ping',
    description: 'Ping!',
    cooldown: 5,
    execute(message: Message) {
        message.channel.send(`Pong! ${message.client.ws.ping} ms`)
    },
}

/**
 * This is code from the discord.js command handler guide.
 * Please, do contribute and improve this code at https://github.com/BronzW/discord.js-template
 */

module.exports = {
    name: 'ping',
    description: 'Ping!',
    cooldown: 5,
    execute(message) {
        message.channel.send(`Pong! ${message.client.ws.ping} ms`)
    },
}

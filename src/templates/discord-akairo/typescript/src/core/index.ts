import Client from './Client'
require('./env')

const client: Client = new Client()

client.login(process.env.BOT_TOKEN)
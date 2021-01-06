import Client from './Client'
require('./env')

const client = new Client()

client.login(process.env.BOT_TOKEN)
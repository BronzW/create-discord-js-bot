const Client = require('./client')
require('./env')

const client = new Client()
client.login(process.env.BOT_TOKEN)

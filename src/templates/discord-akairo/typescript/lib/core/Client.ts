const { AkairoClient, CommandHandler, ListenerHandler } = require('discord-akairo')

export default class Client extends AkairoClient {

    constructor() {
        super(
            {
                /* Sets ownerID to $BOT_OWNER_ID */
                ownerID: process.env.BOT_OWNER_ID,
            },
            {
                /* Makes the bot unable to ping everyone */
                disableMentions: 'everyone',
            }
        )

        /* Initiates the command handler with the specified options */
        this.commandHandler = new CommandHandler(this, {
            directory: __dirname + '/../commands',
            prefix: process.env.DEFAULT_PREFIX,
            defaultCooldown: 2500,
            ignorePermissions: this.ownerID,
            allowMention: true,
            blockBots: true,
            blockClient: true,
            commandUtil: true,
            argumentDefaults: {
                /* Default prompt, just set the start property on the prompt and it will be added to this. */
                prompt: {
                    modifyStart: (_: any, str: any) => `${str}\n\nType \`stop\` to stop the command.`,
                    retry: `You didn't give me the right type of argument! Please try again...`,
                    timeout: `The command has been canceled.`,
                    ended: `You failed to many times, the command has been canceled.`,
                    cancel: `The command has been stopped.`,
                    cancelWord: 'stop',
                    retries: 3,
                    time: 3e4,
                },
            },
            automateCategories: true,
        })

        /* Initiates listener handler */
        this.listenerHandler = new ListenerHandler(this, {
            directory: __dirname + '/../listeners',
        })

        this.listenerHandler.setEmitters({
            CommandHandler: this.commandHandler,
            ListenerHandler: this.listenerHandler,
        })

        /* Loads all commands */
        this.commandHandler.loadAll()

        /* Loads all listeners */
        this.commandHandler.useListenerHandler(this.listenerHandler)
        this.listenerHandler.loadAll()
    }

    /**
     * Logs the bot in with the given token
     * @param {string} token 
     */
    async login(token: string | undefined) {
        return super.login(token)
    }
}

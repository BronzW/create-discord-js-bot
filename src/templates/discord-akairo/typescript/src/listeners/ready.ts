import { Listener } from 'discord-akairo'

export default class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    exec() {
        /* @ts-ignore */
        console.log('Client logged in as ' + this.client.user.tag)
    }
}

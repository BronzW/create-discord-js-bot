#! /usr/bin/env node

const fs = require('fs')

const inquirer = require('inquirer')
const path = require('path')

const { readdir } = require('fs').promises
const ncp = require('ncp').ncp
const exec = require('await-exec')
const chalk = require('chalk')
const shell = require('shelljs')

const [,, ...args] = process.argv
const ora = require('ora')
const cliProgress = require('cli-progress')

const templatePath = path.resolve(__dirname, 'templates')



;(async () => {
    if (args.length === 0) {
        return console.log(`${chalk.red()} You need to provide a name!`)
    }
    const folders = await readdir(templatePath).catch(console.log)

    const { language, framework } = await inquirer.prompt([
        {
            type: 'list',
            message: 'Pick language:',
            name: 'language',
            choices: ['typescript', 'javascript'],
        },
        {
            type: 'list',
            message: 'Pick framework:',
            name: 'framework',
            choices: folders,
        },
    ])

    for (let i of folders) {
        if (framework === i) {
            for (let j of await readdir(path.resolve(templatePath, framework))) {
                if (j === language) {
                    const folder = path.resolve(templatePath, framework, language)
                    const destination = path.resolve(process.cwd(), args[0])
                    if (fs.existsSync(destination)) {
                        return console.log(chalk.yellow('That directory already exists! Try using another name.'))
                    }
                    // @ts-ignore
                    ncp(folder, destination, async (err) => {
                        if (err) {
                            console.error('Error: ' + err)
                        } else {

                            const progressBar = new cliProgress.SingleBar({
                                format: ' 👍 Creating epic code {bar} {percentage}% | {value}/{total}'
                            }, cliProgress.Presets.shades_grey)
                            let total = 5
                            if (framework === 'discord-akairo') total++
                            if (language === 'typescript') total += 2
                            progressBar.start(total, 0)

                            shell.cd(args[0])

                            await exec('npm init -y --loglevel=error')
                            progressBar.increment()

                            await exec(`npm install ${framework} nodemon --save --loglevel=error`)
                            progressBar.increment()

                            await exec(`npm install @types/node --save --loglevel=error`)
                            progressBar.increment()

                            await exec(`npm install dotenv --save --loglevel=error`)
                            progressBar.increment()


                            if (framework === 'discord-akairo') {
                                await exec('npm install discord.js --save --loglevel=error')
                                progressBar.increment()
                            }
                            if (language === 'typescript') {
                                await exec('npm install tsc --save --loglevel=error')
                                progressBar.increment()
                                await exec('npm install typescript --loglevel=error')
                                progressBar.increment()
                            }

                            await exec('npx create-gitignore Node')
                            progressBar.increment()

                            progressBar.stop()
                            const animation = ora({
                                text: 'Finishing...',
                                spinner: {
                                    frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
                                }
                            }).start()
                            await fs.writeFile(destination + '/README.md', '# Discord.js Bot\nUsing ``npx create-discordjs-bot``', () => { })
                            animation.stop()
                            console.log(chalk.green('\nCreated template code!'))

                        }
                    })
                }
            }
        }
    }
})()


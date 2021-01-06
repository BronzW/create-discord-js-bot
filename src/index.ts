#! /usr/bin/env node
const inquirer = require('inquirer')
const path = require('path')

const { readdir, readFile, writedir } = require('fs').promises
const fse = require('fs-extra')
const ncp = require('ncp').ncp

const templatePath = path.resolve(__dirname, 'templates')

;(async () => {
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
                console.log(j)
                if (j === language) {
                    const folder = path.resolve(templatePath, framework, language)
                    const destination = path.resolve(process.cwd(), 'test')
                    // @ts-ignore
                    ncp(folder, destination, (err) => {
                        if (err) {
                            console.error('Error: ' + err)
                        } else {
                            console.log('Success!')
                        }
                    })
                }
            }
        }
    }

    // for (let i of files) {
    //     const frameworkName = i.split('.')[1]
    //     templateFiles[frameworkName] = path.join(templatePaths, i)
    // }

    // const config = await readFile(templateFiles[framework]).catch(console.log)

    // const tsconfig = path.join(process.cwd(), 'tsconfig.json')

    // await writeFile(tsconfig, JSON.stringify(config.toString(), null, 2))

    // console.log('tsconfig.json successfully created')
})()

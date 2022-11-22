#!/usr/bin/env node
/**
 * @author Matthew Evans
 * @module wtfsystems/hiscore_server
 * @see README.md
 * @copyright MIT see LICENSE.md
 */

import fs from 'fs'
import https from 'https'
import crypto from 'crypto'
import mysql from 'mysql'

/**
 * SERVER SETTINGS OBJECT
 */
const settings = {
    port: 7050,  //  Port to run server on

    serverOpts: {
        key: fs.readFileSync('private-key.pem'),   //  Your key file
        cert: fs.readFileSync('client-cert.pem'),  //  Your cert file
        ca: [ fs.readFileSync('server-csr.pem') ]  //  Comment out for production
    }
}

/**
 * Server start
 */
console.log(`\nStarting High Score Server`)
console.log(`Press Ctrl+C to exit\n`)

const server = https.createServer(settings.serverOpts, (req, res) => {
    req.on('error', (error) => { console.error(error) })

    //  Which command to run - we also ignore it if no arguments are passed
    const cmdRoute = req.url.substring(1, req.url.indexOf('?'))
    //  Parameters to the command
    const cmdArgs = (() => { 
        let tempArgs = req.url.slice(req.url.indexOf('?') + 1, req.url.length).split('&')
        let tempObj = {}
        //  Split them up into a labeled object
        tempArgs.forEach((arg) => {
            let tempLabel = arg.substring(0, arg.indexOf('='))
            let tempValue = arg.substring(arg.indexOf('=') + 1, arg.length)
            tempObj[tempLabel] = tempValue
        })
        return tempObj
    })()

    res.writeHead(200)
    if(cmdRoute === 'get-session-key' && req.method == `GET`) {
        const result = (() => {
            if(cmdArgs['game-key'] === undefined) return 1
            //  Run session key generation
            //  Verify provided game key exists in the database
            let key = 0
            //  Generate session key
            return key
        })()
        res.end(`${result}`)
    } else if(cmdRoute === 'send-session-data' && req.method == `GET`) {
        const result = (() => {
            if(cmdArgs['game-key'] === undefined) return 1
            if(cmdArgs['session-key'] === undefined) return 1
            if(cmdArgs['data'] === undefined) return 1
            //  Verify provided game key exists in the database
            //  Checks session key in session log
            //  On success, write game data to database
            return 0
        })()
        res.end(`${result}`)
    } else {  //  Everything else results in a 404
        res.statusCode = 404
        res.end(`Error 404 not found`)
    }

    console.log(cmdRoute)
    console.log(cmdArgs)
})

server.listen(settings.port, () => { console.log(`Running server on port ${settings.port}\n`) })

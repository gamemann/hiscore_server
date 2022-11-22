#!/usr/bin/env node
/**
 * @author Matthew Evans
 * @module wtfsystems/hiscore_server
 * @see README.md
 * @copyright MIT see LICENSE.md
 */

import fs from 'fs'
import https from 'https'
import mysql from 'mysql'

/**
 * SERVER SETTINGS OBJECT
 */
const settings = {
    port: 7050,  //  Port to run server on

    serverOpts: {
        key: fs.readFileSync('private-key.pem'),   //  Your key file
        cert: fs.readFileSync('client-cert.pem'),  //  Your cert file
        ca: [ fs.readFileSync('server-csr.pem')]   //  Comment out for production
    }
}

console.log(`Starting High Score Server`)
console.log(`Press Ctrl+C to exit`)

const server = https.createServer(settings.serverOpts, (req, res) => {
    req.on('error', (error) => { console.error(error) })

    //  Which command to run - we also ignore it if no arguments are passed
    const cmdRoute = req.url.substring(1, req.url.indexOf('?'))
    //  Parameters to the command
    const cmdArgs = (() => { 
        let tempArgs = req.url.slice(req.url.indexOf('?') + 1, req.url.length).split('&')
        let tempArray = []
        //  Split them up into an array of labeled objects
        tempArgs.forEach((arg) => {
            let tempLabel = arg.substring(0, arg.indexOf('='))
            let tempValue = arg.substring(arg.indexOf('=') + 1, arg.length)
            tempArray.push({ [tempLabel]: tempValue })
        })
        return tempArray
    })()

    res.writeHead(200)
    if(cmdRoute === 'get-session-key' && req.method == `GET`) {
        //  Run session key generation

        //  Verify provided game key exists in the database
        //  Generate session key

        res.end(`Here is the key!`)
    } else if(cmdRoute === 'send-session-data' && req.method == `GET`) {
        //  Receive session data and log
        const code = (() => {
            //  Verify provided game key exists in the database
            //  Checks session key in session log
            //  On success, write game data to database
            return 0
        })()
        res.end(`${code}`)
    } else {  //  Everything else results in a 404
        res.statusCode = 404
        res.end(`Error 404 not found`)
    }

    console.log(cmdRoute)
    console.log(cmdArgs)
})

server.listen(settings.port, () => { console.log(`Running server on port ${settings.port}`) })

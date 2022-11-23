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
    port: 7050,                    //  Port to run server on
    algorithm: 'sha512',           //  Crypto algorithm to use
    serverSalt: 'your text here',  //  Additional salt, can be any text

    serverOpts: {
        key: fs.readFileSync('private-key.pem'),   //  Your key file
        cert: fs.readFileSync('client-cert.pem'),  //  Your cert file
        ca: [ fs.readFileSync('server-csr.pem') ]  //  Comment out for production
    },

    mysql: {
        host: 'localhost',
        user: 'user',
        password: 'password',
        database: 'hiscore_db'
    }
}

/**
 * Server start
 */
console.log(`\nStarting High Score Server`)
console.log(`Press Ctrl+C to exit\n`)

var dataResult = null

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
        //  Run session key generation
        const result = (() => {
            if(cmdArgs['game-key'] === undefined) return 1
            //  Verify provided game key exists in the database
            //const sqlconn = mysql.createConnection(settings.mysql)
            sqlconn.connect()
            sqlconn.end()

            //  Generate session salt
            let sessionSalt = Date.toString() + Date.toString() + Date.toString()
            sessionSalt += `${Math.random()}` + `${Math.random()}` + `${Math.random()}`
            sessionSalt += `${Math.random()}` + `${Math.random()}` + `${Math.random()}`
            sessionSalt += `${Math.random()}` + `${Math.random()}` + `${Math.random()}`

            //  Create the session key
            let hash = crypto.createHash(settings.algorithm)
            hash.update(cmdArgs['game-key'])
            hash.update(settings.serverSalt)
            hash.update(sessionSalt)
            hash = hash.digest('hex')

            //  Insert the session key into the DB for later

            return hash  //  Return the output
        })()

        res.end(`${result}`)
    } else if(cmdRoute === 'send-session-data' && req.method == `GET`) {
        //  Run session data storage
        const result = (() => {
            if(cmdArgs['game-key'] === undefined) return 1
            if(cmdArgs['session-key'] === undefined) return 1
            if(cmdArgs['data'] === undefined) return 1
            //  Verify provided game key exists in the database
            //  Checks session key in session log
            //  On success, write game data to database
            dataResult = cmdArgs['data']
            return 0
        })()

        res.end(`${result}`)
    } else {  //  Everything else results in a 404
        res.statusCode = 404
        res.end(`Error 404 not found`)
    }

    console.log(dataResult)
})

server.listen(settings.port, () => { console.log(`Running server on port ${settings.port}\n`) })

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
    //  Script settings
    port: 7050,                    //  Port to run server on
    algorithm: 'sha512',           //  Crypto algorithm to use
    serverSalt: 'your text here',  //  Additional salt, can be any text

    //  HTTPS server settings
    https: {
        key: fs.readFileSync('private-key.pem'),   //  Your key file
        cert: fs.readFileSync('client-cert.pem'),  //  Your cert file
        ca: [ fs.readFileSync('server-csr.pem') ]  //  Comment out for production
    },

    //  MySQL server settings
    mysql: {
        host: 'localhost',      //  Hostname for sql database
        user: 'user',           //  Username for sql database
        password: 'password',   //  Password for sql database
        database: 'hiscore_db'  //  Database name to write to
    }
}

/**
 * Server start
 */
console.log(`\nStarting High Score Server`)
console.log(`Press Ctrl+C to exit\n`)

const server = https.createServer(settings.https, (req, res) => {
    req.on('error', (error) => { console.error(error) })

    console.log(`Received connection from ${req.socket.remoteAddress}`)

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
        //////////////////////////////////
        //  Run session key generation  //
        //////////////////////////////////
        (async () => {
            if(cmdArgs['game-key'] === undefined) return 1
            console.log(`Generating session key for ${req.socket.remoteAddress}`)
            const sqlconn = mysql.createConnection(settings.mysql)
            sqlconn.connect()
            //  Verify provided game key exists in the database
            let sqlError = 0
            await new Promise((resolve, reject) => {
                sqlconn.query(
                    `SELECT Gamekey FROM game_keys WHERE Gamekey LIKE ?`,
                    [ cmdArgs['game-key'] ], (error, results) =>
                {
                    if (error) reject(1)
                    else {
                        if(results.length === 0) {
                            sqlError = 1
                            reject(1)
                        }
                        else {
                            sqlError = 0
                            resolve(0)
                        }
                    }
                })
            }).catch(res => { sqlError = 1 })
            if(sqlError === 1) {
                sqlconn.end()
                return 1
            }
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
            sqlconn.end()

            return hash  //  Return the output
        })().then((result) => { res.end(`${result}`) })
    } else if(cmdRoute === 'send-session-data' && req.method == `GET`) {
        ////////////////////////////////
        //  Run session data storage  //
        ////////////////////////////////
        (async () => {
            if(cmdArgs['game-key'] === undefined) return 1
            if(cmdArgs['session-key'] === undefined) return 1
            if(cmdArgs['data'] === undefined) return 1
            console.log(`Logging session data for ${req.socket.remoteAddress}`)
            const sqlconn = mysql.createConnection(settings.mysql)
            sqlconn.connect()
            //  Verify provided game key exists in the database
            let sqlError = 0
            await new Promise((resolve, reject) => {
                sqlconn.query(
                    `SELECT Gamekey FROM game_keys WHERE Gamekey LIKE ?`,
                    [ cmdArgs['game-key'] ], (error, results) =>
                {
                    if (error) reject(1)
                    else {
                        if(results.length === 0) {
                            sqlError = 1
                            reject(1)
                        }
                        else {
                            sqlError = 0
                            resolve(0)
                        }
                    }
                })
            }).catch(res => { sqlError = 1 })
            if(sqlError === 1) {
                sqlconn.end()
                return 1
            }

            //  Checks session key in session log

            //  On success, write game data to database

            sqlconn.end()
            return 0
        })().then((result) => { res.end(`${result}`) })
    } else {  //  Everything else results in a 404
        res.statusCode = 404
        res.end(`Error 404 not found`)
    }
    console.log(`${req.socket.remoteAddress} disconnected`)
})

server.listen(settings.port, () => { console.log(`Running server on port ${settings.port}\n`) })

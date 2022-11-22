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
    port: 7050,

    serverOpts: {
        key: fs.readFileSync('private-key.pem'),
        cert: fs.readFileSync('client-cert.pem'),
        ca: [ fs.readFileSync('server-csr.pem')]
    }
}

console.log(`Starting High Score Server`)
console.log(`Press Ctrl+C to exit`)

const server = https.createServer(settings.serverOpts, (req, res) => {
    req.on('error', (error) => { console.error(error) })

    //  Which command to run
    const cmdRoute = req.url.substring(1, req.url.indexOf('?'))
    //  Parameters to the command
    const cmdArgs = req.url.slice(req.url.indexOf('?') + 1, req.url.length).split('&')

    res.writeHead(200)
    if(cmdRoute === 'getkey' && req.method == `GET`) {
        res.end(`Here is the key!`)
    } else if(cmdRoute === 'postdata' && req.method == `GET`) {
        res.end(`Give data!`)
    } else {
        res.statusCode = 404
        res.end(`404`)
    }

    //console.log(req.method)
    console.log(req.url)
    console.log(cmdRoute)
    console.log(cmdArgs)
})

server.listen(settings.port, () => { console.log(`Running server on port ${settings.port}`) })
